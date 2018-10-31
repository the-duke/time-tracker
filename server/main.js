import { Meteor } from 'meteor/meteor';
import { Timers } from '../imports/api/timers.js';
import { Logs } from '../imports/api/logs.js';
//import { TimerTotals } from '../imports/api/timerTotals.js';

let config = {
  timerLimit: {
    hours: 0,
    minutes: 10,
    seconds: 0
  },
  logPageSize: 30
};

const isAdmin = (userId) => {
    return true;
};

Meteor.startup(() => {
  if (!Meteor.settings.public.recordsPerPage) {
    Meteor.settings.public['recordsPerPage'] = 10;
  }

  let  defaultUsers = Meteor.settings.defaultUsers || [];

  if (Meteor.settings.removeAllUsers) {
    console.log('remove all users on app start');
    Meteor.users.rawCollection().drop();
  }
  _.each(defaultUsers, function (user) {
    const exsitingUser = Accounts.findUserByEmail(user.email);
    if (exsitingUser) {
      console.log('user exsits - skip user creation for default user:', user.name);
    } else {
      console.log('add default user from settings.json', user.name);
      let id = Accounts.createUser({
        username: user.name,
        email: user.email,
        password: user.password,
        profile: { name: user.name }
      });
      if (user.roles.length > 0) {
        // Need _id of existing user record so this call must come
        // after `Accounts.createUser` or `Accounts.onCreate`
        //Roles.addUsersToRoles(id, user.roles, 'default-group');
      }

    }
  });

  if (Meteor.settings.timerLimit) {
    console.log('use timerLimit settings.json', Meteor.settings.timerLimit);
    Object.assign(config.timerLimit, Meteor.settings.timerLimit);
  }


//  TimerTotals.insert({name: 'karl', minutes: 12});
//  TimerTotals.insert({name: 'egon', minutes: 12});

  const masterTimer = Meteor.setInterval(() => {
    masterTimerLoop();
  }, 1000);
});

function masterTimerLoop () {
 
  const runningTimers = Timers.find({running: true}, { sort: { createdAt: -1 } }).fetch(),
        currentDateObj = new Date();

  runningTimers.forEach((timer) =>{
    //check if timer exceeded timer limit
    const limitDateObj = moment(timer.startedAt)
                          .add(config.timerLimit.hours, 'h')
                          .add(config.timerLimit.minutes, 'm')
                          .add(config.timerLimit.seconds, 's')
                          .toDate();          
    if (limitDateObj.getTime() <= currentDateObj.getTime()) {
      console.log('automatic stop for timer with name', timer.name, 'after timerLimit', config.timerLimit);
      //const duration =  moment.duration(moment(currentDateObj).diff(moment(timer.startedAt)));
      timerCtrl.stopTimer(timer);
    } else {
      //tick timer and update
      timerCtrl.tickTimer(timer);
    }
  });
};

const logCtrl = {
  createLogEntry (timer) {
    console.log('create log entry for timer name', timer.name);
    Logs.insert({
      timerId: timer._id,
      startTime: timer.startedAt,
      endTime: new Date()
    });
  }
};

const timerCtrl = {
  createTimer (timerName) {
      if (!isAdmin(this.userId)) {
        return this.ready();
      }

      console.log('add timer with name', timerName);
      Timers.insert({name: timerName});
  },

  removeTimer (timer) {
      if (!isAdmin(this.userId)) {
        return this.ready();
      }

      console.log('remove timer with id', timer.name);
      Timers.remove(timer._id);
      Logs.remove({timerId: timer._id});
  },

  startTimer (timer) {
    if (timer.running) {
      return;
    }

    console.log('start timer with name', timer.name);
    Timers.update(timer._id, {
      $set: { 
        running: true,
        startedAt: new Date()
      }
    });
  },

  stopTimer (timer) {
    if (!timer.running) {
      return;
    }

    console.log('stop timer with name', timer.name);
    Timers.update(timer._id, {
      $set: { running: false }
    });

    logCtrl.createLogEntry(timer);
  },

  tickTimer (timer) {
    timer.time.seconds++;
    if (timer.time.seconds >= 60) {
      timer.time.seconds = 0;
      timer.time.minutes++;
      if (timer.time.minutes >= 60) {
        timer.time.minutes = 0;
        timer.time.hours++;
      }
    }

    Timers.update(timer._id, {
      $set: { time: timer.time }
    });
  },

  resetTimer (timer) {
    console.log('reset timer with name', timer.name);
    if (timer.running) {
      timerCtrl.stopTimer(timer);
    }

    Timers.update(timer._id, {
      $set: { 
        time: {
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        resettedAt: new Date()
      }
    });
  }
};

async function getTotalTimeByFilter (filter) {
  filter = filter || {};
  const collection = Logs.rawCollection();
  const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
  const group = {
      _id: '$timerId',
      seconds: { 
        $sum: {
          $divide: [
            {$subtract: [ '$endTime', '$startTime' ]},
            1000
          ]
        }
    }
  };

  return await aggregate([
        { $match: filter },
        { $group: group }
  ]).toArray();
};
Meteor.methods(timerCtrl); 

Meteor.publish('timers', function (filter) {
  console.log('start publish timers');
  return Timers.find();
});


Meteor.publish('filterTimerTotals', function (filter) {
  console.log('start publish filterTimerTotals', filter);
//  Timers.find().forEach( (timer) => {
//    this.removed("timerTotals", timer._id);
//  });;
  const runAggregation = (action) => {
    getTotalTimeByFilter(filter).then( (results) => {
      console.log('result', results);
      results.forEach( (result) => {
        console.log('added timerTotal', result);
        const timer = Timers.findOne({ _id: result._id }),
              timerName =  timer? timer.name : 'MISSING',
              time = Math.floor(result.seconds);
        
        const hours = Math.floor(time / 3600),
              minutes = Math.floor( (time - (hours * 3600)) / 60),
              seconds = time - (minutes * 60) - (hours * 3600);

        if (action === 'changed') {
          this.changed("timerTotals", result._id, {
            name: timerName,
            seconds: result.seconds,
            time: {
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }
          });
        } else {
          this.added("timerTotals", result._id, {
            name: timerName,
            seconds: result.seconds,            
            time: {
              hours: hours,
              minutes: minutes,
              seconds: seconds
            }
          });
        }
      })
    });
  };

  // Track any changes on the collection we are going to use for aggregation
  const query = Logs.find(filter);
  let initializing = true;

  const handle = query.observeChanges({
    added: (id) => {
      // observeChanges only returns after the initial `added` callbacks
      // have run. Until then, we don't want to send a lot of
      // `changed()` messages - hence tracking the
      // `initializing` state.
      if (!initializing) {
        runAggregation('changed');
      }
    },
    removed: (id) => {
      runAggregation('changed');
    },
    changed: (id) => {
      runAggregation('changed');
    },
    error: (err)=> {
      throw new Meteor.Error('Uh oh! something went wrong!', err.message);
    }
  });

  // Instead, we'll send one `self.added()` message right after
  // observeChanges has returned, and mark the subscription as
  // ready.
  initializing = false;
  // Run the aggregation initially to add some data to our aggregation collection
  runAggregation();

  this.ready();
});

//https://experimentingwithcode.com/paging-and-sorting-part-1/
Meteor.publish('filteredLogs', function (filter, offset, limit) {
  filter = filter || {};
  offset = offset || 0;
  limit = limit || parseInt(Meteor.settings.public.recordsPerPage) || 10;

  console.log('filteredLogs called', filter, offset, limit);

  Counts.publish(this, 'filteredLogCount', Logs.find(filter), {
    noReady: true
  });

  return Logs.find(filter, {
    limit: limit,
    skip: offset
  })
  
});
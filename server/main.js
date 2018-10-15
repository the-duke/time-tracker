import { Meteor } from 'meteor/meteor';
import { Timers } from '../imports/api/timers.js';
import { Logs } from '../imports/api/logs.js';

let config = {
  timerLimit: {
    hours: 0,
    minutes: 10,
    seconds: 0
  }
}

Meteor.startup(() => {
  var defaultUsers = Meteor.settings.defaultUsers;
  _.each(defaultUsers, function (user) {
    const exsitingUser = Accounts.findUserByEmail(user.email);
    if (exsitingUser) {
      console.log('user exsits - skip user creation for default user:', user.name);
    } else {
      console.log('add default user from settings.json', user.name);
      let id = Accounts.createUser({
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

  // code to run on server at startup
  // const allTimers = Timers.find({});

  // let handle = allTimers.observeChanges({
  //   added: function (id, message) {
  //     //count++;
  //     //console.log(Timers.message + " brings the total to " + count + " messages.",id, message);
  //   },
  //   changed: function (id, fields) {
  //     if (typeof fields['running'] === 'boolean') {
  //        if (fields['running']) {
  //           console.log("timer was started.", id);
            
  //           // const startedAt = new Date();
            
  //           // Timers.update(id, {
  //           //   $set: { startedAt: startedAt }
  //           // });
  //        } else {
  //           console.log("timer was stopped.", id);
  //        }
  //     }
  //   },
  //   removed: function () {
  //     //count--;
  //    // console.log("Lost one. We're now down to " + count + " admins.");
  //   }
  // });


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
  startTimer (timer) {
    console.log('start timer with name', timer.name);
    Timers.update(timer._id, {
      $set: { 
        running: true,
        startedAt: new Date()
      }
    });
  },

  stopTimer (timer) {
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

Meteor.methods(timerCtrl);  
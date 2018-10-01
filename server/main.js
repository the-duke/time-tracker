import { Meteor } from 'meteor/meteor';
import { Timers } from '../imports/api/timers.js';

Meteor.startup(() => {
  // code to run on server at startup
  
  const masterTimer = Meteor.setInterval(() => {
    masterTimerLoop();
  }, 1000);
});

function masterTimerLoop () {
 
  const runningTimers = Timers.find({running: true}, { sort: { createdAt: -1 } }).fetch(),
        tickTimer = (timer) => {
          timer.time.seconds++;
          if (timer.time.seconds >= 60) {
            timer.time.seconds = 0;
            timer.time.minutes++;
            if (timer.time.minutes >= 60) {
              timer.time.minutes = 0;
              timer.time.hours++;
            }
          }
        };

  //console.log(runningTimers);
  runningTimers.forEach((timer) =>{
    tickTimer(timer);
    console.log('update time for', timer.name,  timer.time);
    Timers.update(timer._id, {
      $set: { time: timer.time }
    });
  });
};

// Meteor.methods({
//   foo(arg1, arg2) {
//     check(arg1, String);
//     check(arg2, [Number]);

//     // Do stuff...

//     if (/* you want to throw an error */) {
//       throw new Meteor.Error('pants-not-found', "Can't find my pants");
//     }

//     return 'some return value';
//   },

//   bar() {
//     // Do other stuff...
//     return 'baz';
//   }
// });
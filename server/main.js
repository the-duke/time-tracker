import { Meteor } from 'meteor/meteor';
import '../imports/api/timers.js';

Meteor.startup(() => {
  // code to run on server at startup

});
 

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
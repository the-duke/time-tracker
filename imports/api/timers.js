import { Mongo } from 'meteor/mongo';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';

// class Timer {
//     constructor(doc) {
        

//         // this.name = 'No Name';
//         // this.time = {
//         //     hours: 0,
//         //     minutes: 0,
//         //     seconds: 0
//         // };
//         // this.running = false;

//         _.extend(this, doc);
//         //this.createdAt = new Date();
//     }

//     _tick () {
//       this.time.seconds++;
//       if (this.time.seconds >= 60) {
//         this.time.seconds = 0;
//         this.time.minutes++;
//         if (this.time.minutes >= 60) {
//           this.time.minutes = 0;
//           this.time.hours++;
//         }
//       }
//     }
//   }
  
  // Define a collection that uses `Timer` as its document.
  export const Timers = new Mongo.Collection('timers', {
    //transform: (doc) => new Timer(doc)
  }); 
  
  const Schemas = {};

  Schemas.Time = new SimpleSchema({
    hours: {
      type: Number,
      defaultValue: 0
    },
    minutes: {
      type: Number,
      defaultValue: 0
    },
    seconds: {
      type: Number,
      defaultValue: 0
    }
  });

  Schemas.Timer = new SimpleSchema({
    name: {
      type: String,
      optional: false
    },
    running: {
      type: Boolean,
      defaultValue: false
    },
    time: {
      type:  Schemas.Time,
      defaultValue: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    },
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date()};
        } else {
          this.unset();  // Prevent user from supplying their own value
        }
      }
    }
      //regEx: SimpleSchema.RegEx.Id, optional: true
});

Timers.attachSchema(Schemas.Timer);
import { Mongo } from 'meteor/mongo';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
//import TimeSchema from './timeSchema';

  // Define a collection that uses `Timer` as its document.
  export const Timers = new Mongo.Collection('timers'); 
  
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
      type: Schemas.Time,
      defaultValue: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    },
    startedAt: {
      type: Date,
      defaultValue: new Date()
    },
    resettedAt: {
      type: Date,
      defaultValue: new Date()
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
import { Mongo } from 'meteor/mongo';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
//import TimeSchema from './timeSchema';

// Define a collection that uses `Timer` as its document.
export const Logs = new Mongo.Collection('logs'); 

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


Schemas.Log = new SimpleSchema({
  timerId: {
    type: String,
    optional: false
  },
  userName: {
    type: String,
    defaultValue: 'system',
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  runTime: {
    type:  Schemas.Time,
    defaultValue: {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }
});

Logs.attachSchema(Schemas.Log);
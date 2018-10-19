import { Mongo } from 'meteor/mongo';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
//import TimeSchema from './timeSchema';

  // Define a collection that uses `Timer` as its document.
  export const TimerTotals = new Mongo.Collection('timerTotals');  
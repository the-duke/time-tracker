import { Mongo } from 'meteor/mongo';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
//import TimeSchema from './timeSchema';

  // Define a collection that uses `Timer` as its document.
  export const Settings = new Mongo.Collection('settings');  
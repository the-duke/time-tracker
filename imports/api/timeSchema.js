import SimpleSchema from 'simpl-schema';

// Define a collection that uses `Timer` as its document.
export const TimeSchema = new SimpleSchema({
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
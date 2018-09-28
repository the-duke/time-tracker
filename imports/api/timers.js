import { Mongo } from 'meteor/mongo';
import _ from 'lodash';

class Timer {
    constructor(doc) {
        _.extend(this, doc);

        this.name = 'No Name';
        this.time = {
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        this.running = false;
        this.createdAt = new Date();
    }
  
    start() {
      console.log('start timer', this.name);
      this.time.seconds++;
    //   setInterval(()=>{
    //     this.time.seconds++;
    //   },1000);
        Timers.update(this._id, {
            $set: { time: this.time }
        });
      return this.time.seconds;
    }
  }
  
  // Define a collection that uses `Timer` as its document.
  export const Timers = new Mongo.Collection('timers', {
    transform: (doc) => new Timer(doc)
  });

//export const Timers = new Mongo.Collection('timers');
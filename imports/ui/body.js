import { Template } from 'meteor/templating';
 
import { Timers } from '../api/timers.js';

import './body.html';


Template.body.helpers({
  timers() {
    //return Timers.find({}, { sort: { createdAt: 1 } });
    return Timers.find({});
  },
});

Template.body.events({
  'submit .new-timer'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element  
     const target = event.target,
           name = target.text.value;
 
    // Insert a task into the collection
    Timers.insert({name: name});
    console.log(Timers.find({}).fetch());
    // Clear form
    target.text.value = '';
  },

  'click .stop-all-timers-btn'(event) {
    console.info('stop all timers')
    Timers.find({running:true}).fetch().forEach(timer => {
      Timers.update(timer._id, {
        $set: { running: false }
      });
    });
  }
});

Template.timer.helpers({
  // running () {
  //   ///return Timers.get(this._id).running;
  // },
  formattedTime() {
    if (typeof this.time !== 'object') {
      return '00:00:00';
    }
    return [
      this.time.hours.pad(2),
      this.time.minutes.pad(2),
      this.time.seconds.pad(2)
    ].join(':');
  }
});

Template.timer.events({
  'click .toggle-running-btn'() {
    //if (!this.running) {
      // Meteor.call('start', 1, 2, (error, result) => {
      //   console.log(result);
      // });
    //console.log(this.start());
    //}
    console.info('set timer', this.name, 'to running=', ! this.running);
    // }
    // Set the checked property to the opposite of its current value
    Timers.update(this._id, {
      $set: { running: ! this.running }
    });
  },
  'click .delete-btn'() { 
    Timers.remove(this._id);
  },
});



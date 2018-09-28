import { Template } from 'meteor/templating';
 
import { Timers } from '../api/timers.js';

import './body.html';
 
Template.body.helpers({
  timers2: [
    { name: 'Karl', time: '00:12'},
    { name: 'Heinz', time: '00:23'},
    { name : 'Peter', time: '00:45'},
    { name: 'Jürgen', time: '00:56'},
    { name: 'Dieter', time: '00:67' },
    { name : 'Tobias',time: '00:78' },
  ],
  loggedIn: true,
  loggedIn2 () {
    return true;
  },
  timers() {
    return Timers.find({}, { sort: { createdAt: -1 } });
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
    Timers.insert(Object.assign({
      name: 'No Name',
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      running: false,
      createdAt: new Date(), // current time
    },{
      name,
    }));
 
    // Clear form
    target.text.value = '';
  },
});

Template.timer.helpers({
  // running () {
  //   ///return Timers.get(this._id).running;
  // },
  formattedTime() {
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
    console.log(this.start());
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



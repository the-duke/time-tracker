import { Template } from 'meteor/templating';
import { Timers } from '../../imports/api/timers.js';

import './timersPanel.html';

Template.timersPanel.onRendered(function() {
    console.log('on rendered timersPanel');
    $('.modal').modal();
});

Template.timersPanel.helpers({
    timers() {
      //return Timers.find({}, { sort: { createdAt: 1 } });
      return Timers.find({});
    },
});

Template.timersPanel.events({
    'submit .new-timer'(event) {
        // Prevent default browser form submit
        event.preventDefault();
   
         // Get value from form element  
        const   target = event.target,
                name = target.text.value;
   
        // Insert a task into the collection
        Timers.insert({name: name});
        //console.log(Timers.find({}).fetch());
        // Clear form
        target.text.value = '';
    },
  
    'click .stop-all-timers-btn'(event) {
        console.info('stop all timers')
        Timers.find({running:true}).fetch().forEach(timer => {
            Meteor.call('stopTimer', this, (error, result) => {
                console.log(result);
            });
        });
    }
});
  
Template.timer.helpers({
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
        console.info('set timer', this.name, 'to running=', ! this.running);

        if (!this.running) {
            Meteor.call('startTimer', this, (error, result) => {
                console.log(result);
            });
        } else {
            Meteor.call('stopTimer', this, (error, result) => {
                console.log(result);
            });
        }
    },
    'click .delete-btn'() {
        Timers.remove(this._id);
    },
    'click .reset-btn'() {
        Meteor.call('resetTimer', this, (error, result) => {
            console.log(result);
        });
    }
});
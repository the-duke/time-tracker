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
        console.info('add new timer');
        event.preventDefault();

        const   target = event.target,
                name = target.text.value;
   
        // Insert a task into the collection
        Meteor.call('createTimer', name, (error, result) => {
            console.log(result);
        });
        target.text.value = '';
    },
  
    'click .stop-all-timers-btn'(event) {
        console.info('stop all timers')
        Timers.find({running:true}).fetch().forEach(timer => {
            Meteor.call('stopTimer', timer, (error, result) => {
                console.log(result);
            });
        });
    },

    'click .reset-all-timers-btn'(event) {
        console.info('reset all timers')
        Timers.find().fetch().forEach(timer => {
            Meteor.call('resetTimer', timer, (error, result) => {
                console.log(result);
            });
        });
    }
});
  
Template.timer.helpers({
    runningClass () {
        return this.running? 'running-timer' : '';
    },
    formattedTime () {
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
    //, click .toggle-running-btn
    'click .timer-card .card-content'() {
        console.info('set timer', this.name, 'to running=', ! this.running);

        if (!this.running) {
            Meteor.call('startTimer', this);
        } else {
            Meteor.call('stopTimer', this);
        }
    },
    'click .delete-btn'() {
        Meteor.call('removeTimer', this);
    },
    'click .reset-btn'() {
        Meteor.call('resetTimer', this, (error, result) => {
            console.log(result);
        });
    }
});
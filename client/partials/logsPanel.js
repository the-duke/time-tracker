import { Template } from 'meteor/templating';
import { Logs } from '../../imports/api/logs';

import './logsPanel.html';

Template.logsPanel.helpers({
    logs() {
      //return Timers.find({}, { sort: { createdAt: 1 } });
      return Logs.find({});
    },
});

Template.logsPanel.events({
    'submit .new-timer'(event) {
        // // Prevent default browser form submit
        // event.preventDefault();
   
        //  // Get value from form element  
        // const   target = event.target,
        //         name = target.text.value;
   
        // // Insert a task into the collection
        // Timers.insert({name: name});
        // //console.log(Timers.find({}).fetch());
        // // Clear form
        // target.text.value = '';
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
  
Template.logEntry.helpers({
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

Template.logEntry.events({
    'click .toggle-running-btn'() {
        console.info('set timer');
    },
    'click .delete-btn'() {
        console.info('set timer')
        //Timers.remove(this._id);
    },
    'click .reset-btn'() {

    }
});
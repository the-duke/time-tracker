import { Template } from 'meteor/templating';
import { Logs } from '../../imports/api/logs';
import { Timers } from '../../imports/api/timers';

import './logsPanel.html';

Template.logsPanel.onRendered(function() {
    console.log('on rendered logsPanel');
    
    //const selectInputs = $('.input-field');
    //console.log(selectInputs);
    //$('select').material_select();
    //$('select')
});

Template.logsPanel.helpers({
    logs() {
      //return Timers.find({}, { sort: { createdAt: 1 } });
      return Logs.find({});
    },
});

Template.logsPanel.events({
    'submit .new-timer'(event) {

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
    timerName () {
        var timer = Timers.findOne({ _id: this.timerId });
        return timer? timer.name : 'MISSING';
    },

    startTime () {
        return moment(this.startTime).format('DD.MM.YYYY HH:mm:ss');
    },

    endTime () {
        return moment(this.endTime).format('DD.MM.YYYY HH:mm:ss');
    },

    runTime () {
        const   now = moment(this.endTime),
                then = moment(this.startTime);

        return moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
    },

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
        console.info('delete log-entry with id', this._id);
        Logs.remove(this._id);
    },
    'click .reset-btn'() {

    }
});
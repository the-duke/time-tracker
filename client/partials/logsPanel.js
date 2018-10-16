import { Template } from 'meteor/templating';
import { Logs } from '../../imports/api/logs';
import { Timers } from '../../imports/api/timers';

import './logsPanel.html';

Template.logsPanel.onRendered(function() {
    console.log('on rendered logsPanel');
    this.selectedTimer = new ReactiveVar();
    this.startTime = new ReactiveVar();
    this.endTime = new ReactiveVar();
});

Template.logsPanel.helpers({
    allTimers () {
        var timer = Template.instance().selectedTimer.get();
        return Logs.find(timer ? {timerId: timer._id} : {});
    },
    timers() {
        //return Timers.find({}, { sort: { createdAt: 1 } });
        return Timers.find({});
    },
    initialize () {
        console.log('initialize');
        $('select').material_select();
    },
    logs() {
      //return Timers.find({}, { sort: { createdAt: 1 } });
      //return Logs.find({});
      var   timerId = Template.instance().selectedTimer.get(),
            startTime = Template.instance().startTime.get(),
            endTime = Template.instance().endTime.get();

      console.log('change Log query', timerId);
      let filter = {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      };
      if (timerId) {
        filter['timerId'] = timerId;
      }
      return Logs.find(filter);
    },
});

Template.logsPanel.events({
    'change #timerFilter' (event, target){
        var timerFilter = $(event.target)[0];
        console.log('change selected Timer', timerFilter.value);
        target.selectedTimer.set(timerFilter.value);
    },

    'change #startDateFilter' (event, target){
        var dateFilter = $(event.target);
            date = new Date(dateFilter.val());

        console.log('changed startTime to', date);
        target.startTime.set(date);
    },
    
    'change #endDateFilter' (event, target){
        var dateFilter = $(event.target);
            date = new Date(dateFilter.val());

        console.log('changed endTime to', date);
        target.endTime.set(date);
    },
  
    'click #foo, click .stop-all-timers-btn'(event) {
        console.info('stop all timers')
        Timers.find({running:true}).fetch().forEach(timer => {
            Meteor.call('stopTimer', this, (error, result) => {
                console.log(result);
            });
        });
    }
});

Template.logEntry.onRendered(function() {
    console.log('on rendered logEntry');
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
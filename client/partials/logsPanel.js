import { Template } from 'meteor/templating';
import { Logs } from '../../imports/api/logs';
import { Timers } from '../../imports/api/timers';
import { TimerTotals } from '../../imports/api/timerTotals';

import './logsPanel.html';

Template.logsPanel.onCreated(function bodyOnCreated() {
  //this.state = new ReactiveDict();
   this.selectedTimer = new ReactiveVar();
   this.startTime = new ReactiveVar();
   this.endTime = new ReactiveVar();

    this.autorun(() => {
        const handle = this.subscribe('filterTimerTotals', buildLogFilter() );
       // const isReady = handle.ready();
       // console.log(`Handle is ${isReady ? 'ready' : 'not ready'}`);
    });
});

Template.logsPanel.onRendered(function() {
    console.log('on rendered logsPanel');
   

    //this.totalTimes = new ReactiveVar("Waiting for response from server...");
    //this.updateTotalTimes = () => {
        /*Meteor.call('getTotalTimeByFilter', buildLogFilter(), (error, result) => {
            if(error) {
                console.log(error);
            } else {
                console.log(result);
                this.totalTime.set(result);
            }
        });*/
    //};
    //this.updateTotalTimes();
});


const buildLogFilter = () => {
    const selectedTimer = Template.instance().selectedTimer,
          startTime = Template.instance().startTime,
          endTime = Template.instance().endTime;
    
    let filter = {};
    if (selectedTimer && selectedTimer.get() ) {
        filter['timerId'] = selectedTimer.get();
    }
    if (startTime && startTime.get()) {
        filter['startTime'] = { $gte: startTime.get() };
    }
    if (endTime && endTime.get()) {
        //set end date to 23:59
        let endDateObj = endTime.get();
        endDateObj.setHours(23);
        endDateObj.setMinutes(59);
        filter['endTime'] = { $lte: endDateObj };
    }
    return filter;
};

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
    logs () {
        let filter = buildLogFilter();
        console.log('change Log query filter to', filter);
        return Logs.find(filter);
    },

    timerTotals () {
        return TimerTotals.find();
    },

    formatTotalTime () {
        if (typeof this.time !== 'object') {
            return '00:00:00';
        }
        return [
            this.time.hours.pad(2),
            this.time.minutes.pad(2),
            this.time.seconds.pad(2)
        ].join(':');
    }
    /* timerTotals () {
       
        const totalTimes = Template.instance().totalTime.get();
        console.log('TotalTime helper called', typeof results);
        if (typeof totalTimes === 'object') {
            console.log('compute timerTotals', results);
            return totalTimes.map( (result) => {
                    const timerNames = Timers.find({_id: result._id.timerId}).map( (doc) => {
                        return doc.name;
                    });
                    return {
                        name: timerNames[0],
                        time: result.totalMinites
                    };
                });
        };
    }*/
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
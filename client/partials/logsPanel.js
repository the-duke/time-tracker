import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
        var offset = (currentPage() - 1) * Meteor.settings.public.recordsPerPage;
        console.info('current Paging offset', offset);
        const timersHandle = this.subscribe('timers'),
              filterTimerTotalsHandle = this.subscribe('filterTimerTotals', buildLogFilter() ),
              filteredLogsHandle =  this.subscribe('filteredLogs', buildLogFilter(), offset);

       // const isReady = handle.ready();
       // console.log(`Handle is ${isReady ? 'ready' : 'not ready'}`);
    });
});

// Template.logsPanel.onRendered(function() {
//     console.log('on rendered logsPanel');
// });


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

const hasMorePages = () => {
    var currentPage = parseInt(FlowRouter.current().params.page) || 1;
    var filteredLogCount = Counts.get('filteredLogCount');
    return currentPage * parseInt(Meteor.settings.public.recordsPerPage) < filteredLogCount;
}

const pageCount = () => {
    var filteredLogCount = Counts.get('filteredLogCount');
    return filteredLogCount? Math.ceil(filteredLogCount / parseInt(Meteor.settings.public.recordsPerPage)) : 0;
}

const currentPage = () => {
    return parseInt(FlowRouter.current().params.page) || 1;
}

Template.logsPanel.helpers({
    // allTimers () {
    //     var timer = Template.instance().selectedTimer.get();
    //     return Logs.find(timer ? {timerId: timer._id} : {});
    // },
    timers() {
        return Timers.find({});
    },
    // logs () {
    //     let filter = buildLogFilter();
    //     console.log('change Log query filter to', filter);
    //     return Logs.find(filter);
    // },

    filteredLogCount () {
        return Counts.get('filteredLogCount');
    },

    filteredLogs () {
        return Logs.find();
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
    },

    paginationInfo: function () {
        return currentPage() + ' / ' + pageCount()
    },

    prevPage: function() {
        return '#';
        // const previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
        // //return FlowRouter.routes.logs.path({page: previousPage});
        // FlowRouter.go('logs', { page: previousPage });
    },

    nextPage: function() {
        return '#';
    }
});

Template.logsPanel.events({
    'change #timerFilter' (event, target) {
        var timerFilter = $(event.target)[0];
        console.log('change selected Timer', timerFilter.value);
        target.selectedTimer.set(timerFilter.value);
    },

    'change #startDateFilter' (event, target) {
        var dateFilter = $(event.target);
            date = new Date(dateFilter.val());

        console.log('changed startTime to', date);
        target.startTime.set(date);
    },
    
    'change #endDateFilter' (event, target) {
        var dateFilter = $(event.target);
            date = new Date(dateFilter.val());

        console.log('changed endTime to', date);
        target.endTime.set(date);
    },
  
    'click #prevPage' (event) {
        console.info('go to prev page');
        const previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
        FlowRouter.go('logs', { page: previousPage });
    },

    'click #nextPage' (event) {
        console.info('go to next page');
        const nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
        FlowRouter.go('logs', { page: nextPage });
    }
});

Template.logEntry.onRendered(function() {
    console.log('on rendered logEntry');
    // initialize materializecss' form elements
    $('select').material_select();
    $('#startDateFilter').pickadate({
        //format: 'dd.mm.yyyy',
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        onStart: function() {
            var date = new Date();
            this.set('select', [date.getFullYear(), date.getMonth(), 1 /*date.getDate()*/]);
        }
        // closeOnSelect: false // Close upon selecting a date,
    });
    $('#endDateFilter').pickadate({
        //format: 'dd.mm.yyyy',
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        onStart: function() {
            var date = new Date();
            this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        }
        // closeOnSelect: false // Close upon selecting a date,
    });
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
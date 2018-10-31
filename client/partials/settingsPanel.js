import { Template } from 'meteor/templating';
import { Timers } from '../../imports/api/timers.js';

import './settingsPanel.html';


Template.settingsPanel.onCreated(function bodyOnCreated() {
    this.autorun(() => {
        const timersHandle = this.subscribe('timers');
    });
  });

Template.settingsPanel.onRendered(function() {

});

Template.settingsPanel.helpers({
    settings() {
      //return Timers.find({}, { sort: { createdAt: 1 } });
      return Timers.find({});
    },
});

Template.timersPanel.events({

});
  
Template.settingRecord.helpers({

});

Template.settingRecord.events({
    //, click .toggle-running-btn
    'click .timer-card .card-content'() {
        console.info('set timer', this.name, 'to running=', ! this.running);
    }});
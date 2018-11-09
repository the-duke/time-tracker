import { Template } from 'meteor/templating';
import { Settings } from '../../imports/api/settings.js';

import './settingsPanel.html';


Template.settingsPanel.onCreated(function bodyOnCreated() {
    this.autorun(() => {
        const settingsHandle = this.subscribe('settings');
    });
  });

Template.settingsPanel.onRendered(function() {

});

Template.settingsPanel.helpers({
    settings() {
      //return Timers.find({}, { sort: { createdAt: 1 } });
      return Settings.find({});
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
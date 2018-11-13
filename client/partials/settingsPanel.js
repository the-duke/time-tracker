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
    settings () {
      return Settings.find({});
    },
    resValueTemplate () {
        switch(typeof this.value){
            case 'boolean': 
                return Template.settingValueBoolean;
            case 'number': 
                return Template.settingValueNumber;
            case 'object':    
                return Template.settingValueTime;
            case 'string':
            default:   
                return Template.settingValueString;
        }
    },
    testValueType (valueType) {
        console.info('test testValueType', this);
        switch (valueType) {
            case 'string':
                break;
            case 'boolean':
                break;
            case 'time':
                break;
        }
        return false;
    }
});

Template.timersPanel.events({

});
  
Template.settingValueBoolean.helpers({
    checked () {
        return this.value? 'checked':'';
    }
});

Template.settingValueBoolean.events({
    'change input[type=checkbox]' (evt) {
        const value = evt.target.checked;
        Meteor.call('updateSetting', this.key, value, (error, result) => {
            console.log(result);
        });
    }
});

Template.settingValueNumber.events({
    'change input[type=range]' (evt) {
        const value = parseInt(evt.target.value, 10);
        Meteor.call('updateSetting', this.key, value, (error, result) => {
            console.log(result);
        });
    }
});

Template.settingValueTime.helpers({
    hours () {
        return this.value.hours;
    },
    minutes () {
        return this.value.minutes;
    },
    seconds () {
        return this.value.seconds;
    }
});

Template.settingValueTime.events({
    'change input[type=text]' (evt) {
        const input = evt.target;
        //const setting = Settings.findOne({_id: this._id});
        console.info(this.value, evt);
        this.value[input.id] = input.value;
        Meteor.call('updateSetting', this.key, this.value, (error, result) => {
            console.log(result);
        });
    }
});
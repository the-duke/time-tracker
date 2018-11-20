import { Settings } from '../imports/api/settings.js';
import { ServerHelpers } from './helpers.js';

let defaultSettings = { 
    public: {
        timerLimitEnable: true,
        timerLimitTime: {
            hours: 0,
            minutes: 10,
            seconds: 0
        },
        recordsPerPage: 30
    }
  };
  Object.assign(Meteor.settings, defaultSettings);
  console.log(Meteor.settings);

if (Meteor.settings.removeAllUsers) {
    console.log('remove all users on app start');
    Meteor.users.rawCollection().drop();
}

let  defaultUsers = Meteor.settings.defaultUsers || [];

_.each(defaultUsers, function (user) {
    const exsitingUser = Accounts.findUserByEmail(user.email);
    if (exsitingUser) {
        console.log('user exsits - skip user creation for default user:', user.name);
    } else {
        console.log('add default user from settings.json', user.name);
        let id = Accounts.createUser({
        username: user.name,
        email: user.email,
        password: user.password,
        profile: { name: user.name }
        });
        if (user.roles.length > 0) {
        // Need _id of existing user record so this call must come
        // after `Accounts.createUser` or `Accounts.onCreate`
        //Roles.addUsersToRoles(id, user.roles, 'default-group');
        }

    }
});

//ensure that timerLimitEnable is persistent in db
let timerLimitEnableSetting = Settings.findOne({key: 'timerLimitEnable'});
if (!timerLimitEnableSetting) {
    console.log('store initial timerLimitEnableSetting in settings collection', Meteor.settings.public.timerLimitEnable);
    Settings.insert({
        key: 'timerLimitEnable',
        name: 'Timer Auto-Off Enabled',
        value: Meteor.settings.public.timerLimitEnable
    })
} else {
    Object.assign(Meteor.settings.public, timerLimitEnableSetting.value);
}

//ensure that timerLimitTime is persistent in db
let timerLimitTimeSetting = Settings.findOne({key: 'timerLimitTime'});
if (!timerLimitTimeSetting) {
    console.log('store initial timerLimitTime in settings collection', Meteor.settings.public.timerLimitTime);
    Settings.insert({
        key: 'timerLimitTime',
        name: 'Max Timer Limit for Auto-Off',
        value: Meteor.settings.public.timerLimitTime
    })
} else {
    Object.assign(Meteor.settings.public, timerLimitTimeSetting.value);
}

//ensure that recordsPerPage is persistent in db
let recordsPerPageSetting = Settings.findOne({key: 'recordsPerPage'});
if (!recordsPerPageSetting) {
    console.log('store initial recordsPerPage in settings collection', Meteor.settings.public.recordsPerPage);
    Settings.insert({
        key: 'recordsPerPage',
        name: 'Number of Log-Entries per Page',
        value: Meteor.settings.public.recordsPerPage
    })
} else {
    Object.assign(Meteor.settings.public, recordsPerPageSetting.value);
}

Meteor.publish('settings', function (filter) {
    return Settings.find();
});

Meteor.methods({
    updateSetting (key, value) {
        if (!ServerHelpers.isAdmin(this.userId)) {
            return this.ready();
        }
        
        const setting = Settings.findOne({key: key});
        if (setting) {
            console.log('update setting with id=', setting, 'key=', key, '=', value);
            Settings.update(setting._id, {
                $set: { value: value }
            });
        } else {
            throw new Error('no setting found for key=', key);
        }
    }
});
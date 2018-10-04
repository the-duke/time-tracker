import { Template } from 'meteor/templating';

import '../partials/timersPanel.js';
import '../partials/logsPanel.js';

import './mainLayout.html';

Template.mainLayout.onRendered(function() {
    console.log('on rendered mainLayout');
    //$('.modal').modal();
    
});


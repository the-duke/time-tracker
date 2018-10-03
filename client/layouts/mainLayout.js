import { Template } from 'meteor/templating';

import '../partials/timersPanel.js';
import '../partials/logsPanel.js';

import './mainLayout.html';


$(document).ready(function(){
    $('.modal').modal();
});


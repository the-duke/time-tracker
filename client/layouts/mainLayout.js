import { Template } from 'meteor/templating';

import '../partials/timersPanel.js';
import '../partials/logsPanel.js';

import './mainLayout.html';

Template.mainLayout.onRendered(function() {
    console.log('on rendered mainLayout');
    //$('.modal').modal();
    // $(document).ready(function() {
    //     console.info('document ready'); 
    //     $('select').material_select();
    // });
});

// Template.body.onRendered(function() {
//     console.log('on rendered body');
//     //$('.modal').modal();
//     $(document).ready(function() {
//         console.info('document ready'); 
//         $('select').material_select();
//     });
// });


import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// if (Meteor.isClient) {
//     FlowRouter.wait();
//     Tracker.autorun(function() {
//         if (Roles.subscription.ready() && AccountsTemplates._initialized && !FlowRouter._initialized) {
//             FlowRouter.initialize()
//         }
//     });
// }
FlowRouter.route('/', { 
    name: 'timers',
    action: function () {
        BlazeLayout.render('mainLayout' ,{
            content: "timersPanel"
        });
    }
});

FlowRouter.route('/logs/:page?', { 
    name: 'logs',
    action: function (params, queryParams) {
        BlazeLayout.render('mainLayout' ,{
            content: "logsPanel"
        });
    }
});

FlowRouter.route('/settings/', { 
    name: 'settings',
    action: function () {
        BlazeLayout.render('mainLayout' ,{
            content: "settingsPanel"
        });
    }
});

FlowRouter.route('/blog/:postId', {
    action: function(params, queryParams) {
        console.log("Yeah! We are on the post:", params.postId);
    } 
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
    action() {
        // Show 404 error page
        BlazeLayout.render('notFound');
    }
});
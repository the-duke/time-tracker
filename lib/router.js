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
    name: 'home',
    action: function () {
        console.log("Yeah! We are on the Home layout");
        BlazeLayout.render('HomeLayout');
    }
});

FlowRouter.route('/blog/:postId', {
    action: function(params, queryParams) {
        console.log("Yeah! We are on the post:", params.postId);
    } 
});

const ServerHelpers = {
    isAdmin (userId) {
        if (Meteor.user().profile) {
            return Meteor.user().profile.name === 'admin';
        }
        return false;
    }
};

export { ServerHelpers };
Template.stats.helpers({
  all_users: function() {
    return Meteor.users.find().count();
  }
})

Meteor.subscribe('poll_listings');

Template.stats.helpers({
  all_users: function() {
    return Meteor.users.find().count();
  }
})

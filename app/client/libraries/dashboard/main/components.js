Meteor.subscribe('poll_listings');

Template.stats.helpers({
  all_users: function() {
    return Meteor.users.find().count();
  }
})

Template.stats.events({
  'click #quitDelegate': function() {
    Meteor.call('quit_delegate', Meteor.userId(), function(error, success) {
      console.log(error, success);
    })
  }
})

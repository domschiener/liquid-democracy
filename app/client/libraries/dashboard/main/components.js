Meteor.subscribe('poll_listings');

Template.stats.helpers({
  delegateInfo: function(delegate_data) {
    return Delegates.findOne({_id: delegate_data});
  },
  delegateCount: function(delegations) {
    if (delegations) {
      return Object.keys(delegations).length;
    }
    else {
      return 0;
    }
  }
})

Template.stats.events({
  'click #quitDelegate': function() {
    Meteor.call('quit_delegate', Meteor.userId(), function(error, success) {
      if (!error) {
        console.log("You have successfully quit.")
      }
    })
  }
})

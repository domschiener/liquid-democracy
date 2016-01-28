Meteor.subscribe('poll_listings');

Template.stats.helpers({
  delegateInfo: function(delegate_data) {
    return Delegates.findOne({_id: delegate_data});
  },
  delegateCount: function(delegations) {
    console.log(delegations);
    return Object.keys(delegations).length;
  }
})

Template.stats.events({
  'click #quitDelegate': function() {
    Meteor.call('quit_delegate', Meteor.userId(), function(error, success) {
      console.log(error, success);
    })
  }
})

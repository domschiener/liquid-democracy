Template.personal.helpers({
  personal_profile: function(delegate_id) {
    if (delegate_id === Meteor.userId()) {
      return true;
    }
    return false;
  },
  delegateInfo: function(delegate_data) {
    return Delegates.findOne({_id: delegate_data});
  },
  delegateExpertise: function(user, delegate) {
    var delegations = []
    user.delegates.forEach(function(delegation) {
      if (delegation.delegate == delegate.userID) {
        delegations.push(delegation.domain);
      }
    })

    return delegations;
  }
})

Template.personal.events({
  'click .revoke_delegate': function() {
    var delegate = this;
    var user = Meteor.userId();

    Meteor.call('revoke_delegate', delegate, user);
  }
})

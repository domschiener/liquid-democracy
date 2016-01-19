Template.personal.helpers({
  personal_profile: function(delegate_id) {
    if (delegate_id === Meteor.userId()) {
      return true;
    }
    return false;
  },
  delegateInfo: function(delegate_data) {
    return Delegates.findOne({_id: delegate_data});
  }
})

Template.personal.events({
  'click .revoke_delegate': function() {
    var delegate = this;
    var user = Meteor.userId();

    Meteor.call('revoke_delegate', delegate, user);
  }
})

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

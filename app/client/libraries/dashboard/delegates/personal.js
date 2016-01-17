Template.personal.helpers({
  personal_profile: function(delegate_id) {
    if (delegate_id === Meteor.userId()) {
      return true;
    }
    return false;
  },
  delegateInfo: function(delegate_data) {
    console.log(delegate_data);
    return Delegates.findOne({_id: delegate_data});
  },
  testter: function(data) {
    console.log(data);
  }
})

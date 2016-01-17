Template.delegates.onRendered(function() {
  $(".select2").select2({
    width: 200,
  })
});

Template.delegates.helpers({
  not_delegated: function(delegate_id) {
    if (delegate_id === Meteor.userId()) {
      return false;
    }
    if (Meteor.user().delegates) {
      var delegates = Meteor.user().delegates;
      for (var i = 0; i < delegates.length; i++) {
        if (delegate_id === delegates[i].delegate) {
          return false;
        }
      }
    }
    return true;
  }
})

Template.delegates.events({
  'click #delegate__submit': function() {
    var delegate = {}
    delegate['description'] = $("#personal__description").val();
    delegate['domain'] = $("#personal_expertise").select2("val");

    var user = Meteor.users.findOne({_id: Meteor.userId()});
    delegate['userID'] = user._id;
    delegate['username'] = user.services.github.username;

    HTTP.get('https://api.github.com/users/' + delegate['username'], function(error, result) {
      delegate['profile_pic'] = result.data.avatar_url;
      delegate['name'] = result.data.name;
      delegate['link'] = result.data.html_url;
      Meteor.call('new_delegate', delegate, function(error, success) {
        if (!error) {
          console.log(success);
        }
      });
    })
  },
  'click .delegatePerson': function(event) {
    var domain = $('.delegateExpertise').select2("val");
    var user = Meteor.userId();
    var delegate = this._id;

    Meteor.call('delegation', domain, user, delegate, function(error, success) {
      console.log(success);
    });
  }
});

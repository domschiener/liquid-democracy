Template.delegates.rendered = function() {
  $(".domain_select").select2({
    width: 200,
    allowClear: true
  });
}

Template.delegates.helpers({
  personal_profile: function(delegate_id) {
    if (delegate_id === Meteor.userId()) {
      return true;
    }
    return false;
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
  'click #delegate': function(event) {
    var domain = $('#delegate_experience').select2("val");
    var user = Meteor.userId();
    var delegate = this._id;

    Meteor.call('delegation', domain, user, delegate, function(error, success) {
      console.log(success);
    });
  }
});

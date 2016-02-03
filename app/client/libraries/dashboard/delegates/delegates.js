Template.delegates.rendered = function() {
  $.fn.modal.Constructor.prototype.enforceFocus = function() {};
  $(".select2").select2({
    width: 200
  })
}

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
    delegate['domain'] = $("#personal_expertise").val();

    //If no description or domain entered, return false
    if (delegate['description'] === '' || delegate['domain'] === null) {
      return false;
    }
    $('#becomeDelegate').modal('hide');
    
    var user = Meteor.users.findOne({_id: Meteor.userId()});
    delegate['userID'] = user._id;
    delegate['username'] = user.services.github.username;

    HTTP.get('https://api.github.com/users/' + delegate['username'], function(error, result) {
      delegate['profile_pic'] = result.data.avatar_url;
      delegate['name'] = result.data.name;
      delegate['link'] = result.data.html_url;

      Meteor.call('new_delegate', delegate, function(error, success) {
        if (!error) {

          console.log("You are a Delegate now! Use your powers wisely");
        }
      });
    })
  },
  'click .delegatePerson': function() {
    var domain = $('.delegateExpertise').val();
    var user = Meteor.user();
    var delegate = this._id;

    Meteor.call('delegation', domain, user, delegate, function(error, success) {
      if (error) {
        $('.delegates').append('<div class="alert alert-danger delegationError"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>ERROR!</strong>' + error.message + ' </div>')
      }
    });
  }
});

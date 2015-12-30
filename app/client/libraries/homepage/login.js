Template.login.events({
  'click #github_login' : function() {
    Meteor.loginWithGithub({loginStyle: "redirect", requestPermissions: ['user']}, function(error, success) {
      console.log(success);
    });
  }
})

Template.login.events({
  'click #github_login' : function() {
    Meteor.loginWithGithub({loginStyle: "redirect"});
  }
})

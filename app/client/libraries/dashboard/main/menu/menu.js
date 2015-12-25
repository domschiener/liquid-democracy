Template.dashboard_menu.onRendered(function() {
  new gnMenu( document.getElementById( 'gn-menu' ) );
});

Template.dashboard_menu.events({
  'click #menu_logout': function() {
    console.log("success");
    Meteor.logout();
  }
})

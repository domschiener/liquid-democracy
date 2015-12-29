Template.poll.helpers({
  option_count: function(count) {
    return (count === 2)
  },
  single_option: function(index, options) {
    return options[index];
  }
});

Template.poll.events({
  'click .option_click': function(event) {
    var option = event.target.id;
    var user = Meteor.userId();
    var poll = Session.get('current_poll');

    Meteor.call('new_vote', option, user, poll, function(error, success) {
      if (!error) {
        // var route = "/dashboard/vote/" + poll + "/voted";
        // Router.go('voted');
        console.log("sucss");
      }
    });
  }

})

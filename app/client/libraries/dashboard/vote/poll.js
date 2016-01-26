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
    var delegate = Meteor.user().delegate;
    var poll = this._id;

    Meteor.call('new_vote', option, user, delegate, poll, function(error) {
      if (!error) {
        var path = "/dashboard/vote/" + poll + "/voted";
        Router.go(path);
      }
    });
  }

})

Meteor.publish('poll_listings', function() {
  //TODO: Subscribe only to active and public polls
  return poll.find();
});

Meteor.methods({
  post_data: function(data) {
    return poll.insert({ poll: data, createdAt: new Date() }, function(error, success) {
      //TODO More rigorous error checking when failed to insert
      return success;
    });
  }
})

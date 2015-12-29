Meteor.publish('poll_listings', function() {
  //TODO: Subscribe only to active and public polls
  return poll.find();
});

Meteor.methods({
  post_data: function(data) {
    return poll.insert({poll: data, createdAt: new Date() }, function(error, success) {
      if (!error) {
        return success;
      }
      return error;
    });
  },
  new_vote: function(option, userID, pollID) {
    Uservotes.insert({voter: userID, option: option, poll: pollID,votedAt: new Date()}, function(error, success) {
      console.log("lol");
      if (!error) {
        poll.update({_id: pollID}, {$push: {votes: option}}, function(error, success) {
          if (!error) {
            console.log("succcess");
            return success;
          }
        });
      }
      return error;
    });
  }
})

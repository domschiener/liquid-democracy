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
  },
  new_delegate: function(data) {
    Meteor.users.update({_id: data.userID}, {$set: {'delegate': true}});
    return Delegates.insert({_id: data.userID, 'delegate': data}, function(error, success) {
      return success;
    });
  },
  get_delegates: function() {
    return Delegates.find({}, {delegate: 1}).fetch();
  },
  delegation: function(domain, user, delegate) {
    // TODO: Find way to use domain as key in document
    if (delegate === user) {
      return false;
    }

    Meteor.users.update({_id: user}, {$push: {'delegates': {'delegate': delegate, 'domain': domain}}});

    for (var i = 0; i < domain.length; i++) {
      Delegates.update({_id: delegate}, {$push: {'delegations': {'domain': domain[i], 'user': user}}})
    }

    return true;
  }
})

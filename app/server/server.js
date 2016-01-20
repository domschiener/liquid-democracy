function voteCounting(poll_id, domain) {
  var votes = Uservotes.find({_id: poll_id}).fetch();

  var voters = [];
  var delegates = [];

  for (var i = 0; i < votes.vote.length; i++) {
    if (votes.vote[i].delegate) {
      delegates.push(votes.vote[i]);
    } else {
      voters.push(votes.vote[i]);
    }
  }

  var delegateVoters = Delegates.findOne({_id: delegates[0].voter});

  return resursiveCount(voters, delegateVoters, false, delegates, domain);
}

function resursiveCount(votestructure, current_delegate, pop_delegate, delegates, domain) {

  if (delegates.length < 1) {
    return votestructure;
  }

  if (pop_delegate) {
    delegates.shift();
    current_delegate = Delegates.findOne({_id: delegates[0].voter});
  }

  var voterStructure = {
    'voter'
  }

  var containsDelegates = false;

  for (var j = 0; j < current_delegate.delegations.length; j++) {
    var current_voter = Meteor.users.findOne({_id: current_delegate.delegations[j]['user']});

    if (current_voter)


    if (current_delegate.delegations[j].domain === domain && voters.indexOf(current_delegate.delegations[j].user) === -1) {
      count += 1;
    }
  }
}

Meteor.startup(function() {
  //process.env.HTTP_FORWARDED_COUNT = 1;

  function polldeadline(poll_input, _current_date) {
    var current_poll = poll_input;
    var current_date = _current_date;

    var timer = Meteor.setTimeout(function() {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + " went offline!");
      poll.update({_id:current_poll._id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
      Meteor.clearTimeout(timer);
      //TODO: Make transaction that changes contract state
    }, (current_poll.endDate - current_date));

    console.log("New timer set for Poll: " + current_poll._id);
  }

  //
  // set the deadline for each poll on server startup
  //
  var active_polls = poll.find({'poll.isvoted': false}).fetch();
  for (var i = 0; i < active_polls.length; i++) {
    var current_poll = active_polls[i];
    var current_date = Date.now();
    if ((current_poll.endDate - current_date) <= 0) {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + " went offline!");
      poll.update({_id:current_poll._id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
    }
    else {
      polldeadline(current_poll,current_date);
    }
  }
})



Meteor.methods({
  new_poll: function(poll_data, deadline) {
    var start_date = Date.now();
    return poll.insert({poll: poll_data, endDate: deadline, createdAt: start_date}, function(error, success) {
      if (!error) {
        Meteor.setTimeout(function() {
          console.log("ID: " + success + " went offline!");
          poll.update({_id: success}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
        },(deadline - start_date));
        return success;
      }
      return error;
    });
  },
  new_vote: function(option, userID, isDelegate, pollID) {
    return Uservotes.update(
      {_id: pollID},
      {$push: {vote: {voter: userID, delegate: isDelegate, option: option, votedAt: Date.now()}}},
      {upsert: true},
      function(error, success)
      {
        if (!error) {
          //TODO: temporary, for increased fairness only publish poll results after end
          return poll.update({_id: pollID}, {$push: {votes: option}}, function(result) {
            return result;
          });
        }
      }
    );
  },
  new_delegate: function(data) {
    Meteor.users.update({_id: data.userID}, {$set: {'delegate': true, 'description': data.description, 'profile_pic': data.profile_pic, 'expertise': data.domain}});

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
  },
  revoke_delegate: function(delegateobj, user) {
    Meteor.users.update({_id: user}, {$pull: {delegates: {delegate: delegateobj._id}}});
    Delegates.update({_id: delegateobj._id}, {$pull: {delegations: {user: user}}});
  }
})

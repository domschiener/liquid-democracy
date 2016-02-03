/**
  *   Main Vote Counting Function
  **/

function voteCounting(poll_id, domain) {
  var votes = Uservotes.findOne({_id: poll_id});

  var voters = [];
  var delegates = [];

  for (var i = 0; i < votes.vote.length; i++) {
    if (votes.vote[i].delegate) {
      delegates.push(votes.vote[i]);
    } else {
      voters.push(votes.vote[i]);
    }
  }

  //For Each delegate, we get all connected delegations and input into new JSON object
  var output = voters.slice();

  delegates.forEach(function(delegateVote) {
    var currDelegate = Delegates.findOne({_id: delegateVote.voter});
    if (currDelegate.delegations) {
      output.push(recursiveCount(delegates, voters, currDelegate, delegateVote, domain));
    }
    else {
      output.push(delegateVote);
    }
  })

  //Then we count all of the voters in the new JSON object
  var count = 0;
  output.forEach(function(voter) {
    count += finalCount(voter);
  })

  poll.update({_id: poll_id}, {$set: {'outcome': output, 'count': count}});
}

/**
  *   Recursive Count Helper Functions
  **/

function voterVoted(votestructure, voter) {
  var found = false;

  votestructure.forEach(function(curr_voter) {
    if (curr_voter.voter === voter) {
      found = true;
    }
  });

  return found;
}

function delegateVoted(votestructure, voter) {
  var found = false;

  votestructure.forEach(function(curr_voter) {
    if (curr_voter.voter === voter) {
      found = true;
    }
  });

  return found;
}

function hasDomain(domains, voter) {
  var found = false;

  domains.forEach(function(domain) {
    if (voter.domain === domain) {
      found = true;
    }
  })

  return found;
}

function finalCount(voter) {
  var count = 1;
  if (voter.delegates) {
    voter.delegates.forEach(function(delegVoter) {
      if (delegVoter.delegates) {
        count += finalCount(delegVoter);
      }
      else {
        count += 1;
      }
    });
  }

  return count;
}


/**
  *   Recursive Count Function
  **/

function recursiveCount(delegateVoters, votersVoters, delegate, curVoter, domain) {

  var voterObj = {
    'voter': delegate._id,
    'option': curVoter.option,
    'delegates': []
  }
  delegate.delegations.forEach(function(delegVoter) {
    // If not domain-delegation, don't count Voter
    if (hasDomain(domain, delegVoter) === false) {
      return false;
    }

    // Retrieve current voter object
    var voter = Meteor.users.findOne({_id: delegVoter.voter});;

    //
    //  If the Voter is a Delegate, retrieve his information and get all delegations
    //
    if (voter.delegate &&
        delegateVoted(delegateVoters, voter._id) !== true) {
      // Retrieve new Delegate object
      var newDelegate = Delegates.findOne({_id: voter._id});

      // Go through delegations and return them to the current voterObj
      voterObj.delegates.push(recursiveCount(delegateVoters, votersVoters, newDelegate, curVoter, domain));
    }
    //
    //  If voter is not delegate himself, we create a new object and append to delegate voterObj
    //
    else if (voter.delegate !== true &&
            voterVoted(votersVoters, voter._id) !== true) {
      var newVoter = {};
      newVoter['voter'] = voter._id;
      newVoter['option'] = curVoter.option;
      voterObj.delegates.push(newVoter);
    }
  })

  return voterObj;
}



Meteor.startup(function() {
  //process.env.HTTP_FORWARDED_COUNT = 1;

  function polldeadline(poll_input, _current_date) {
    var current_poll = poll_input;
    var current_date = _current_date;

    var timer = Meteor.setTimeout(function() {
      console.log("ID:" + current_poll._id + " Name: " + current_poll.poll.name + " went offline!");
      poll.update({_id:current_poll._id}, {$set: {'poll.isvoted': true, 'poll.isactive':false}});
      voteCounting(current_poll._id, current_poll.poll.domain);
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
          voteCounting(success, poll_data.domain);
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

    // Delegation Check: Only one Delegate per Domain possible
    if (user.delegates) {
      user.delegates.forEach(function(existingDelegate) {
        for (var i = 0; i < domain.length; i++) {
          for (var j = 0; j < existingDelegate.domain.length; j++) {
            if (existingDelegate.domain[j] === domain[i]) {
              throw new Meteor.Error('existingDelegation', ' You already have a delegation for this Domain. Change your existing delegation relationships or modify the new delegation you intend to make. ');
            }
          }
        }
      })
    }

    //
    //   Function used for Circular Delegation Check
    //   Checks if inbound delegation, matches outbound delegation
    //
    function traverseCheck(delegate, userDelegate, domain) {
      // Circular delegation only possible nly if delegate has outbound delegations
      var delegateProfile = Meteor.users.findOne({_id: delegate});
      if (delegateProfile.delegates) {
        userDelegate.delegations.forEach(function(userDelegations) {
          if (userDelegations.voter === delegate &&
              userDelegations.domain === domain) {
            throw new Meteor.Error('circularDelegation', ' Your Delegation would create a circular Delegation and is therefore currently not possible. Please check your delegation relationships and retry again.')
          }
          else if (userDelegations.domain === domain){
            console.log(userDelegations.voter, delegation.delegate)
            traverseCheck(delegation.delegate, userDelegate, domain)
          }
        })
      }
    }


    // If the current user is a delegate herself, check for circular delegation
    if (user.delegate) {
      var userDelegate = Delegates.findOne({_id: user._id});

      // Circular delegation only possible if user already has existing inbound delegations
      if (userDelegate.delegations) {
        // Check if inbound delegation matches outbound delegation
        domain.forEach(function(delegDomain) {
          traverseCheck(delegate, userDelegate, delegDomain);
        })
      }
    }

    // For every domain, we create a extra delegation entry in the User and Delegations collection
    for (var i = 0; i < domain.length; i++) {
      Meteor.users.update({_id: user._id}, {$push: {'delegates': {'delegate': delegate, 'domain': domain[i]}}});
      Delegates.update({_id: delegate}, {$push: {'delegations': {'domain': domain[i], 'voter': user._id}}})
    }

    return true;
  },
  revoke_delegate: function(delegateobj, user) {
    //
    //  Removes a single Delegation Relationship
    //
    Meteor.users.update({_id: user}, {$pull: {'delegates': {'delegate': delegateobj._id}}});
    Delegates.update({_id: delegateobj._id}, {$pull: {'delegations': {'voter': user}}});
  },
  quit_delegate: function(delegateID) {
    //
    //  Removes a Delegate as well as all delegations
    //
    var delegate = Delegates.findOne({_id: delegateID});

    if (delegate.delegations) {
      delegate.delegations.forEach(function(delegation) {
        Meteor.users.update({_id: delegation.voter}, {$pull: {'delegates': {'delegate': delegateID}}});
      })
    }

    Meteor.users.update({_id: delegateID}, {$set: {'delegate': false, 'expertse': false}});
    Delegates.remove({_id: delegateID});
  }
})

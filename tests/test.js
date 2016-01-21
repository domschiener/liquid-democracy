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
  // Exit function, if all delegates searched, return the JSON output
  if (delegates.length < 1) {
    return votestructure;
  }

  // If we want through all voters of a delegate, pop delegate and restart with new delegate
  if (pop_delegate) {
    delegates.shift();
    current_delegate = Delegates.findOne({_id: delegates[0].voter});
  }

  var voterObj = {
    'voter': current_delegate.voter;
    'option': current_delegate.option ? current_delegate.option : delegates[0].option;
    'votedAt': current_delegate.votedAt ? current_delegate.votedAt : delegates[0].votedAt;
    'delegates': [];
  }

  var containsDelegates = false;

  for (var j = 0; j < current_delegate.delegations.length; j++) {
    var current_voter = Meteor.users.findOne({_id: current_delegate.delegations[j]['user']});

    // If current_voter is a Delegate herself, we call the function recursively counting voters
    if (current_voter.delegate) {
      containsDelegates = true;
      voterObj.delegates.push(recursiveCount());
    }
    else if (current_delegate.delegations[j].domain === domain && voters.indexOf(current_delegate.delegations[j].user) === -1) {
      // If voter is not delegate himself, we create a new object and append to delegate voterObj
      var newVoter = {};
      newVoter['voter'] = current_delegate.delegations[j].user
      newVoter['option'] = delegates[0].option;
      newVoter['votedAt'] = delegates[0].votedAt;
      newVoter['delegates'] = [];

      voterObj.delegates.push(newVoter);
    }

    IF NO MORE DELEGATES, RETURN THE VOTE STRUCTURE
  }

  // If delegates, return the voter obj, else pop delegate and start anew
  if (containsDelegates) {
    return voterObj;
  }
  votestructure.push(voterObj);
  return recursiveCount()
}

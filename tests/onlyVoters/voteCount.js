var fs = require('fs');

function voteCounting(poll_id, domain) {
  var votes = fs.readFileSync('./uservotes.json', "utf8");
  votes = JSON.parse(votes);

  var voters = [];
  var delegates = [];

  for (var i = 0; i < votes.vote.length; i++) {
    if (votes.vote[i].delegate) {
      delegates.push(votes.vote[i]);
    } else {
      voters.push(votes.vote[i]);
    }
  }
  var current_delegate;
  var allDelegates = fs.readFileSync('./delegates.json', "utf8");
  allDelegates = JSON.parse(allDelegates);

  allDelegates.forEach(function(delegate) {
    if (delegate._id === delegates[0].voter) {
      current_delegate = delegate;
    }
  })

  recursiveCount(voters, current_delegate, false, delegates, domain, allDelegates);
}

function voterVoted(votestructure, voter) {
  votestructure.forEach(function(curr_voter) {
    if (curr_voter.voter === voter) {
      return true;
    }
  });

  return false;
}

function finalCount(votestructure) {
  var count = 0;

  votestructure.forEach(function(voter) {
    count += 1;
    if (voter.delegates) {
      console.log(count);
      voter.delegates.forEach(function(delegateVoters) {
        count += 1;
      })
      console.log(count);
    }
  });

  return count;
}

function recursiveCount(votestructure, current_delegate, pop_delegate, delegates, domain, allDelegates) {
  // Exit function, if all delegates searched, return the JSON output
  if (delegates.length < 1) {
    var count = finalCount(votestructure);
    fs.writeFile('./votestructure.json', JSON.stringify(votestructure), {flag: "w+"}, function(error, success) {
      if (!error) {
        console.log("Successfully generated Votestructure. Final Count: ", count);
      }
    });
    return votestructure;
  }

  // If we went through all voters of a delegate, pop delegate and restart with new delegate
  if (pop_delegate) {
    allDelegates.forEach(function(delegate) {
      if (delegate._id === delegates[0].voter) {
        current_delegate = delegate;
      }
    });
  }

  var voterObj = {
    'voter': current_delegate.voter === true ? current_delegate.voter : delegates[0].voter,
    'option': delegates[0].option,
    'delegates': []
  }

  var allVoters = fs.readFileSync('./voters.json', "utf8");
  allVoters = JSON.parse(allVoters);
  var containsDelegates = false;

  for (var j = 0; j < current_delegate.delegations.length; j++) {
    var current_voter;

    allVoters.forEach(function(voter) {
      if (voter._id === current_delegate.delegations[j]['voter']) {
        current_voter = voter;
      }
    });

    // If current_voter is a Delegate herself, we call the function recursively counting voters
    // if (current_voter.delegate) {
    //   containsDelegates = true;
    //   console.log("here");
    //   voterObj.delegates.push(recursiveCount(votestructure, current_voter, false, delegates, domain, allDelegates));
    // }
    if (current_delegate.delegations[j].domain === domain &&
        voterVoted(votestructure, current_delegate.delegations[j].voter) !== true) {
      // If voter is not delegate himself, we create a new object and append to delegate voterObj
      var newVoter = {};
      newVoter['voter'] = current_delegate.delegations[j].voter;
      newVoter['option'] = delegates[0].option;
      voterObj.delegates.push(newVoter);
    }

    // IF NO MORE DELEGATES, RETURN THE VOTE STRUCTURE
  }

  // If delegates, return the voter obj, else pop delegate and start anew
  if (containsDelegates) {
    return voterObj;
  }

  votestructure.push(voterObj);

  // If we went through all voters of a delegate, pop delegate and restart with new delegate
  delegates.shift();

  recursiveCount(votestructure, current_delegate, true, delegates, domain, allDelegates);
}

voteCounting('xr8on9pchumcxr', 'main');

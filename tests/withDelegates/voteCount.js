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

  var allDelegates = fs.readFileSync('./delegates.json', "utf8");
  allDelegates = JSON.parse(allDelegates);

  var allVoters = fs.readFileSync('./voters.json', "utf8");
  allVoters = JSON.parse(allVoters);

  var output = voters.slice();

  allDelegates.forEach(function(delegate, index) {
    delegates.forEach(function(current_delegate) {
      if (delegate._id === current_delegate.voter) {
        console.log(index);
        output.push(recursiveCount(delegates, voters, delegate, current_delegate, allVoters, allDelegates, domain));
      }
    })
  })

  fs.writeFile('./votestructure.json', JSON.stringify(output), {flag: "w+"}, function(error, success) {
    if (!error) {
      console.log("Successfully generated Votestructure. Final Vote Count: ");
    }
  });

  //recursiveCount(voters, current_delegate, false, delegates, domain, allDelegates);
}

/**
  *   Recursive Count Helper Functions
  **/

function voterVoted(votestructure, voter) {
  votestructure.forEach(function(curr_voter) {
    if (curr_voter.voter === voter) {
      return true;
    }
  });

  return false;
}

function delegateVoted(votestructure, voter) {
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
      voter.delegates.forEach(function() {
        count += 1;
      })
    }
  });

  return count;
}


function recursiveCount(delegateVoters, votersVoters, delegate, curVoter, allVoters, allDelegates, domain) {

  var voterObj = {
    'voter': delegate._id,
    'option': curVoter.option,
    'delegates': []
  }

  delegate.delegations.forEach(function(delegVoter) {
    // Retrieve current voter object
    var voter;
    allVoters.forEach(function(newVoter) {
      if (newVoter._id === delegVoter.voter) {
        voter = newVoter;
      }
    });

    if (voter.delegate &&
        delegVoter.domain === domain &&
        delegateVoted(delegateVoters, voter._id) !== true) {
      // Retrieve new Delegate object
      var newDelegate;
      allDelegates.forEach(function(delegate) {
        if (delegate._id === voter._id) {
          newDelegate = delegate;
        }
      })
      console.log("New delegate", newDelegate);

      voterObj.delegates.push(recursiveCount(delegateVoters, votersVoters, newDelegate, curVoter, allVoters, allDelegates, domain));
    }
    else if (delegVoter.domain === domain &&
            voterVoted(votersVoters, voter._id) !== true) {
      // If voter is not delegate himself, we create a new object and append to delegate voterObj
      var newVoter = {};
      newVoter['voter'] = voter._id;
      newVoter['option'] = curVoter.option;
      voterObj.delegates.push(newVoter);
    }
  })

  return voterObj;
}


function recursiveCount2(votestructure, current_delegate, pop_delegate, delegates, domain, allDelegates) {
  // Exit function, if all delegates searched, return the JSON output
  console.log(delegates.length);
  if (delegates.length < 1) {
    var count = 5; //finalCount(votestructure);
    fs.writeFile('./votestructure.json', JSON.stringify(votestructure), {flag: "w+"}, function(error, success) {
      if (!error) {
        console.log("Successfully generated Votestructure. Final Vote Count: ", count);
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
    'voter': current_delegate._id,
    'option': delegates[0].option,
    'delegates': []
  }

  var allVoters = fs.readFileSync('./voters.json', "utf8");
  allVoters = JSON.parse(allVoters);

  for (var j = 0; j < current_delegate.delegations.length; j++) {
    var current_voter;

    allVoters.forEach(function(voter) {
      if (voter._id === current_delegate.delegations[j]['voter']) {
        current_voter = voter;
      }
    });

    // If current_voter is a Delegate herself, we call the function recursively counting voters
    if (current_voter.delegate) {
      var newDelegate;
      console.log("New delegate", current_voter);
      allDelegates.forEach(function(delegate) {
        if (delegate._id === current_voter._id) {
          newDelegate = delegate;
        }
      });
      console.log(newDelegate);
      voterObj.delegates.push(recursiveCount(votestructure, newDelegate, false, delegates, domain, allDelegates));
    }
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
  if (pop_delegate === false) {
    console.log("return", voterObj);
    return voterObj;
  }

  votestructure.push(voterObj);

  // If we went through all voters of a delegate, pop delegate and restart with new delegate
  delegates.shift();

  return recursiveCount(votestructure, current_delegate, true, delegates, domain, allDelegates);
}

voteCounting('xr8on9pchumcxr', 'main');

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
        output.push(recursiveCount(delegates, voters, delegate, current_delegate, allVoters, allDelegates, domain));
      }
    })
  })
  var count = 0;
  output.forEach(function(voter) {
    count += finalCount(voter);
  })

  fs.writeFile('./votestructure.json', JSON.stringify(output), {flag: "w+"}, function(error, success) {
    if (!error) {
      console.log("Successfully generated Votestructure. Final Vote Count: ", count);
    }
  });

  //recursiveCount(voters, current_delegate, false, delegates, domain, allDelegates);
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

voteCounting('xr8on9pchumcxr', 'main');

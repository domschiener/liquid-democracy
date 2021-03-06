var fs = require('fs');

var domains = ['main', 'finance'];

function randomID() {
  return Math.random().toString(36).substring(4);
}

/**
  *   Generates random user objects that represent the structure of the MongoDB collection
  **/

function genUsers(numTimes) {
  var allResults = [];
  var delegates = [];
  var voters = [];
  var output = [];


  for (var i = 0; i < numTimes; i++) {
    var constructor = {};
    constructor['_id'] = randomID();
    // With 30% probability, voter == delegate
    constructor['delegate'] = Math.random() >= 0.7 ? true : false;
    if (constructor['delegate']) {
      constructor['expertise'] = Math.random() >= 0 ? 'main' : 'finance';
      delegates.push(constructor['_id']);
    }
    else {
      voters.push(constructor['_id']);
    }
    output.push(constructor);
  }

  fs.writeFile('./voters.json', JSON.stringify(output), {flag: "w+"}, function(error, success) {
    if (!error) {
      console.log("Successfully generated Users.")
    }
  });
  allResults.push(delegates, voters, output);

  return allResults;
}

/**
  *   Generates (random) JSON Object with delegation relationships between voters.
  *   Saves the object locally in delegates.json
  **/

function genDelegates(allResults) {
  var delegates = allResults[0];
  var voters = allResults[1];
  var users = allResults[2];
  var output = [];

  function delegations(expertise, delegate) {
    // We basically take a random amount of voters and add them to the delegate
    var voter = [];
    var limit1 = Math.floor(Math.random() * voters.length);
    var limit2 = Math.floor(Math.random() * voters.length);

    var iterations = voters.splice(Math.min(limit1, limit2), Math.min(limit1, limit2));
    iterations.forEach(function(item) {
      var newVoter = {
        'domain': expertise,
        'voter': item
      }
      voter.push(newVoter);
    });

    // With 15 % probability, there is a delegation between two delegates.
    if (Math.random() >= 0.75) {
      var randomChoice = Math.floor(Math.random() * delegates.length)
      if (delegates[randomChoice] !== delegate) {
        var newVoter = {
          'domain': expertise,
          'voter': delegates[randomChoice]
        }
        console.log("New Delegate relationship", delegate, delegates[randomChoice])
        voter.push(newVoter);
      }
      else {
        var newVoter = {
          'domain': expertise,
          'voter': delegates[randomChoice - 1]
        }
        console.log("New Delegate relationship!", delegate, delegates[randomChoice - 1])
        voter.push(newVoter);
      }
    }

    return voter;
  }

  delegates.forEach(function(delegate) {
    users.forEach(function(user) {
      if (user._id === delegate) {
        var constructor = {};

        constructor['_id'] = delegate;
        constructor['delegate'] = [{'domain': user.expertise}];
        constructor['delegations'] = voters[0] === undefined ? [] : delegations(user.expertise, delegate);

        output.push(constructor);
      }
    })
  })

  fs.writeFile('./delegates.json', JSON.stringify(output), {flag: "w+"}, function(error, success) {
    if (!error) {
      console.log("Successfully generated Delegates.")
    }
  });
  return output;
}


/**
  *     Generates a new poll and lets delegates and users vote
  **/

function genUservotes(allVoters) {
  // Generates a (somewhat) random constructor of uservotes
  var constructor = {}
  constructor['_id'] = 'xr8on9pchumcxr'; //randomID();
  constructor['vote'] = [];

  allVoters.forEach(function(voter, index) {
    var isDelegate = voter.delegate;

    if (isDelegate) {
      var tmpVoter = {
        "voter": voter._id,
        "option": Math.random() >= 0.5 ? 'Yes' : 'NO',
        "delegate": isDelegate,
        "poll": constructor['_id']
      }

      constructor['vote'].push(tmpVoter);
    }
    else {
      // With 15% probability, the voter herself will vote (even if delegation)
      if (Math.random() >= 0.85) {
        var tmpVoter = {
          "voter": voter._id,
          "option": Math.random() >= 0.5 ? 'Yes' : 'NO',
          "delegate": isDelegate,
          "poll": constructor['_id']
        }

        constructor['vote'].push(tmpVoter);
      }
    }
  })

  fs.writeFile('./uservotes.json', JSON.stringify(constructor), {flag: "w+"}, function(error, success) {
    if (!error) {
      console.log("Successfully generated Uservotes.")
    }
  });
  return constructor;
}



var voters = genUsers(50);
var delegates = genDelegates(voters);
var votes = genUservotes(voters[2]);

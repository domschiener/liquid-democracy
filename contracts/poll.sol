contract NewPoll {
  //defines the poll
  struct Poll {
    bytes32 title;
    //stringified options array
    string options;
    // The type (i.e. domain) of the poll
    bytes32 type;
    uint deadline;
    bool status;
    uint numVotes;
  }

  // event tracking of all votes and poll end
  event NewVote(bytes32 votechoice);
  event PollEnded(string end, bytes32 _title);

  modifier live { if (p.status) _ }

  // declare a public poll called p
  Poll public p;

  //initiator function that stores the necessary poll information
  function NewPoll(bytes32 _title, string _options, bytes32 _type, uint _deadline) {
    p.title = _title;
    p.options = _options;
    p.type = _type;
    p.deadline = _deadline;
    p.status = true;
    p.numVotes = 0;
  }

  //function for user vote. input is a string choice
  function vote(bytes32 choice) live {
    //If the poll deadline is reached, we end the poll and don't record the vote
    if (now > p.deadline) {
      endPoll();
    } else {
      p.numVotes += 1;
      NewVote(choice);
    }
  }

  // can be independently called to see if poll has ended
  function isEnd() live {
    if (now > p.deadline) {
      endPoll();
    }
  }

  //when time limit is reached, set the poll status to false
  function endPoll() internal {
    p.status = false;
    PollEnded('Poll has officially ended', p.title);
  }
}

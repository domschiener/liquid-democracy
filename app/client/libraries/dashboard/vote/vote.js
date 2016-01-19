Template.vote.helpers({
  getDate: function(timestamp) {
    return new Date(timestamp);
  },
  vote_count: function() {
    var current_poll = this;
    if (current_poll.votes) {
      return current_poll.votes.length;
    }
    else {
      return 0;
    }
  }
})

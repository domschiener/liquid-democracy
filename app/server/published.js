Meteor.publish('pollListings', function() {
  if (this.userId) {
    return poll.find({});
  } else {
    this.ready();
  }
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {'services': 1});
  } else {
    this.ready();
  }
});

Meteor.publish("delegatesData", function () {
  //Make it so that only people who delegated can view the delegate
  if (this.userId) {
    return Delegates.find({});
  } else {
    this.ready();
  }
});

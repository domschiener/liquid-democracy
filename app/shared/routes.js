Router.route('/', {
  template: 'home'
});

Router.route('/join', {
  name: 'join',
  template: 'login',
  onBeforeAction: function() {
    if(Meteor.user()) {
      Router.go('dashboard');
    } else {
      this.next();
    }
  }
});

Router.route('/logout', {
  name: 'logout',
  template: 'login',
  onRun: function() {
    Meteor.logout();
    Router.go('join');
    this.next();
  }
});

Router.route('/dashboard', {
  name: 'dashboard',
  layoutTemplate: 'dashboard_menu',
  template: 'dashboard',
  data: function() {
    var active_polls = poll.find({'poll.isvoted': false}, {sort: {createdAt: -1}}).fetch();
    var past_polls = poll.find({'poll.isvoted': true}, {sort: {createdAt: -1}}).fetch();
    // Only return the last 10 issues
    return {'polls': active_polls.slice(0, 10), 'pastPolls': past_polls.slice(0, 10)};
  },
  onBeforeAction: function() {
    var user =  Meteor.userId();
    if(user) {
      this.next();
    } else {
      Router.go('join');
    }
  }
});

Router.route('/dashboard/vote', {
  name: 'vote',
  layoutTemplate: 'dashboard_menu',
  template: 'vote',
  data: function() {
    var active_polls = poll.find({'poll.isvoted': false}, {sort: {createdAt: -1}}).fetch();
    var past_polls = poll.find({'poll.isvoted': true}, {sort: {createdAt: -1}}).fetch();
    return {'polls': active_polls, 'pastPolls': past_polls};
  },
  onBeforeAction: function() {
    var user =  Meteor.userId();
    if(user) {
      this.next();
    } else {
      Router.go('join');
    }
  }
});

Router.route('/dashboard/vote/:_id', {
  name: 'poll',
  layoutTemplate: 'dashboard_menu',
  template: 'poll',
  data: function() {
    return poll.findOne({_id: this.params._id});
  },
  onBeforeAction: function() {
    var user =  Meteor.userId();

    // If no user logged in, redirect to join
    if(user) {
      this.next();
    } else {
      Router.go('join');
    }

    var current_poll = poll.findOne({_id: this.params._id});
    if (current_poll) {
      if (current_poll.poll.isvoted) {
        Router.go('voted', {_id: this.params._id});
      }
    }
  }
});

Router.route('/dashboard/results/:_id/', {
  name: 'voted',
  layoutTemplate: 'dashboard_menu',
  template: 'voted',
  data: function() {
    return poll.findOne({_id: this.params._id});
  },
  onBeforeAction: function() {
    var user =  Meteor.userId();
    if(user) {
      this.next();
    } else {
      Router.go('join');
    }

    var current_poll = poll.findOne({_id: this.params._id});
    if (current_poll) {
      if (current_poll.poll.isvoted === false) {
        Router.go('poll', {_id: this.params._id});
      }
    }
  }
});

Router.route('/dashboard/create', {
  name: 'create',
  layoutTemplate: 'dashboard_menu',
  template: 'create',
  onBeforeAction: function() {
    var user =  Meteor.userId();
    if(user) {
      this.next();
    } else {
      Router.go('join');
    }
  }
});

Router.route('/dashboard/delegates', {
  name: 'delegates',
  layoutTemplate: 'dashboard_menu',
  template: 'delegates',
  data: function() {
    var delegates = Delegates.find({}).fetch();
    return {'delegates': delegates};
  },
  onBeforeAction: function() {
    var user =  Meteor.userId();
    if(user) {
      this.next();
    } else {
      Router.go('join');
    }
  }
})

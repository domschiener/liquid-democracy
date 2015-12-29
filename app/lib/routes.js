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

Router.route('/dashboard', {
  name: 'dashboard',
  layoutTemplate: 'dashboard_menu',
  template: 'dashboard',
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
    var active_polls = poll.find({}).fetch();
    return {'polls': active_polls};
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
    if(user) {
      Session.set('current_poll', this.params._id);
      this.next();
    } else {
      Router.go('join');
    }
  }
});

Router.route('/dashboard/vote/:_id/voted', {
  name: 'voted',
  layoutTemplate: 'dashboard_menu',
  template: 'voted',
  data: function() {
    return poll.findOne({_id: this.params._id});
  },
  onBeforeAction: function() {
    var user =  Meteor.userId();
    if(user) {
      Session.set('current_poll', this.params._id);
      this.next();
    } else {
      Router.go('join');
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

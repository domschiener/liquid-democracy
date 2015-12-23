Router.route('/', {
  template: 'home'
});

Router.route('/join', {
  name: 'join',
  template: 'login',
  onBeforeAction: function() {
    if(Meteor.user()) {
      var route = "/dashboard";
      Router.go(route);
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
    if(Meteor.user()) {
      this.next();
    } else {
      var route = "/join";
      Router.go(route);
    }
  }
});

Router.route('/dashboard/vote', {
  name: 'vote',
  layoutTemplate: 'dashboard_menu',
  template: 'vote',
  onBeforeAction: function() {
    if(Meteor.user()) {
      this.next();
    } else {
      var route = "/join";
      Router.go(route);
    }
  }
});

Router.route('/dashboard/create', {
  name: 'create',
  layoutTemplate: 'dashboard_menu',
  template: 'create',
  onBeforeAction: function() {
    if(Meteor.user()) {
      this.next();
    } else {
      var route = "/join";
      Router.go(route);
    }
  }
});

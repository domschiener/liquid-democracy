Router.route('/', {
  template: 'home'
});

Router.route('/dashboard', function() {
  this.layout('dashboard_menu');
  this.render('dashboard');
}, {
  name: 'dashboard'
});

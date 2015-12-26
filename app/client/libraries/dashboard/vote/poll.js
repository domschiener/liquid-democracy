Template.poll.helpers({
  option_count: function(count) {
    return (count === 2)
  },
  single_option: function(index, options) {
    return options[index];
  }
});

Template.poll.events({
  'click .option_click': function(event) {
    
  }

})

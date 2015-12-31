Meteor.subscribe("userData");

Template.delegates.rendered = function() {
  $("#personal_expertise").select2({
    width: 200,
    allowClear: true
  });
}

Template.delegates.events({
  'click #delegate__submit': function() {
    console.log($("#personal__description").val());
    console.log($("#personal_expertise").select2("val"));
  }
});

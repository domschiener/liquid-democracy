Template.create.rendered = function() {
  Session.set('NumberOfOptions', 2);

  $("#domain_select").select2({
    width: 200,
    allowClear: true
  });

  $(function() {
    var img_cnt = $('li.activate').index() + 1;

    var img_amt = $('li.form-group').length;
    $('.img_cnt').html(img_cnt);
    $('.img_amt').html(img_amt);
    var progress = ($('.img_cnt').text() / $('.img_amt').text()) * 100;
    $('.progress-bar').css("width", progress + "%");
    $('.make_btn_appear').keyup(function() {
      $('#nxt').removeClass("hide fadeOutDown").addClass("fadeInUp");
    })
    $('.popup_success').keyup(function() {
      $('#submit').removeClass("hide fadeOutDown").addClass("fadeInUp");
    })

    $('#nxt').click(function() {
      $('#nxt').removeClass("fadeInUp").addClass('hide fadeOutDown');

      if ($('.progress-form li').hasClass('activate')) {

        $('p.alerted').removeClass('fadeInLeft').addClass('fadeOutUp');

        var $activate = $('li.activate');
        var $inactive = $('li.inactive');
        $activate.removeClass("fadeInRightBig activate").addClass('fadeOutLeftBig hidden');
        $inactive.removeClass("hide inactive").addClass("activate fadeInRightBig").next().addClass('inactive');

        var img_cnt = $('li.activate').index() + 1;

        var img_amt = $('li.form-group').length;
        $('.img_cnt').html(img_cnt);
        $('.img_amt').html(img_amt);
        var progress = ($('.img_cnt').text() / $('.img_amt').text()) * 100;
        $('.progress-bar').css("width", progress + "%");
      }
    });
  });
}

Template.create.events({
  'click #submit': function() {
    event.preventDefault();
    num_options = Session.get('NumberOfOptions');
    var poll = {
      'name': '',
      'description': '',
      'options': '',
      'isactive': false,
      'isvoted': false,
    }

    poll['name']= $('#name_poll').val();
    poll['description'] = $('#description').val();
    var option = [];
    for (var i = 1; i <= num_options; i++) {
      element_id = "#option-" + i;
      option.push($(element_id).val());
    }

    poll['options'] = option;
    //poll['multi_option'] = $('#multi_option_switch').is(":checked");
    var hours = $('#hour_limit option:selected').text();
    var days = $('#day_limit option:selected').text();

    poll['domain'] = $("#domain_select").select2("val");

    poll['limit_hours'] = parseInt(hours.match(/\d+/)[0]);
    poll['limit_days'] = parseInt(days.match(/\d+/)[0]);

    Meteor.call('post_data', poll, function(error, success) {
      Router.go('poll', {_id: success});
    });
  }
})

Template.timelimit.helpers({
  hours: function(){
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  },
  days: function() {
    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  }
});

Template.more_options.events({
  'click #add_option' : function () {

    //Update session storage for NumberOfOptions
    var numOptions = Session.get('NumberOfOptions') + 1;

    if (numOptions <= 10) {
      console.log("success");
      //Create new DOM element for additional Option
      var new_option = document.createElement("div");
      new_option.className = "form-group";
      new_option.innerHTML = '<input id="option-' + numOptions + '" type="text" value="" maxlength="20" placeholder="Option ' + numOptions +'" class="form-control poll_options" />';
      document.getElementById('options').appendChild(new_option);
      console.log("success2");
      Session.set('NumberOfOptions', numOptions);
    }
  },
  'click #rmv_option' : function() {
    var numOptions = Session.get('NumberOfOptions');

    if (numOptions > 2) {
      var elementId = 'option-' + numOptions;
      var element_to_remove = document.getElementById(elementId).parentNode;
      document.getElementById('options').removeChild(element_to_remove);

      //Update Session
      Session.set('NumberOfOptions', numOptions - 1);
    }
  }
});

Template.voted.helpers({
  topGenresChart: function() {
    var current_poll = poll.findOne(Session.get('current_poll'));
    var poll_options = current_poll.poll.options;

    var votes_counted = {};
    if (current_poll.votes) {
      for (var i = 0, j = current_poll.votes.length; i < j; i++) {
         votes_counted[current_poll.votes[i]] = (votes_counted[current_poll.votes[i]] || 0) + 1;
      }
    }
    console.log(votes_counted);

    var votes_full = [];
    for (var i = 0; i < poll_options.length; i++) {
      var option = poll_options[i];
      if (votes_counted[option]) {
        votes_full.push(votes_counted[option]);
      }
      else {
        votes_full.push(0);
      }
    }

    return {
        chart: {
            backgroundColor: '#fff',
            type: 'bar',
        },
        title: {
          text: ''
        },
        xAxis: {
            categories: poll_options,
            labels: {
              style: {
                fontSize: '16px',
                color: '#000'
              }
            }
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            labels: {
                overflow: 'justify',
                style: {
                  fontSize: '13px',
                  color: '#000'
                },
            },
            title: {
              text: ''
            },
            gridLineColor: 'transparent',
            lineColor: 'transparent'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: votes_full,
            color: '#2ecc71',
            name: 'Votes',
            showInLegend: false,
            dataLabels: {
              enabled: true,
              color: '#000',
              style: {
                fontSize: '16px'
              }
            }
        }]
      }
    }
})

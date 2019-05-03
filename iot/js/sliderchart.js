function timestamp(str) {
    return new Date(str).getTime();
}

var weekdays = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
];

var months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

function nth(d) {
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function formatDate(date) {
    return weekdays[date.getDay()] + ", " +
        date.getDate() + nth(date.getDate()) + " " +
        months[date.getMonth()] + " " +
        date.getFullYear();
}

var dateSlider = document.getElementById('slider-date');

noUiSlider.create(dateSlider, {
    range: {
        min: timestamp('2019-01-01'),
        max: timestamp('2019-03-28')
    },
    step: 24 * 60 * 60 * 1000,
    start: [timestamp('2019-01-20'), timestamp('2019-03-08')],
    format: wNumb({
        decimals: 0
    })
});

var dateValues = [
    document.getElementById('event-start'),
    document.getElementById('event-end')
];

function printChart() {
  var data = {
    labels: [],
    datasets: [
      {
        label: "Temperature",
        fillColor: "rgba(220, 220, 220, 0.2)",
        strokeColor: "rgba(1, 1, 1, 1)",
        pointColor: "rgba(1, 1, 1, 1)",
        pointStrokeColor: "rgba(1, 1, 1, 1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220, 220, 220, 1)",
        data: []
      },
      {}
    ]
  };

  fetch('http://127.0,0,1:3000/temps')
.then(response => {
  return response.json()
})
.then(data => {
  // Work with JSON data here
  console.log(data)
})
.catch(err => {

})

    var outsideData = [];
    var heatingFlowData = [];
    var returnFlowData = [];
    var warmWaterData = [];

    var ctx = document.getElementById("tempChart").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [dateValues[0].innerHTML, dateValues[1].innerHTML],
            datasets: [{
                data: [4.7, 10.8, 4.9, 5.0, 5.1, 5.2, 5.1, 5.0, 4.9, 4.8, 4.9, 4.8, 4.7, 4.6, 4.5],
                label: "Outside",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: [28.3, 26.8, 26.4, 26.3, 26.1, 30.8, 31.1, 31.2, 32.0, 32.7, 33.1, 33.3],
                label: "Heating flow",
                borderColor: "#8e5ea2",
                fill: false
            }, {
                data: [26.2, 25.9, 25.8, 25.9, 26.6, 27.1, 27.5, 27.7, 27.8, 27.5, 27.9, 28.1],
                label: "Return flow",
                borderColor: "#3cba9f",
                fill: false
            }, {
                data: [47.7, 47.8, 47.7, 47.8, 47.7, 47.6, 47.7, 47.5, 47.6, 47.8, 47.9, 47.8],
                label: "Warm water",
                borderColor: "#e8c3b9",
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Temperature profile'
            }
        }
    });
};

dateSlider.noUiSlider.on('update', function(values, handle) {
    dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
});

printChart();
dateSlider.noUiSlider.on('change', function(values, handle) {
    printChart();
});

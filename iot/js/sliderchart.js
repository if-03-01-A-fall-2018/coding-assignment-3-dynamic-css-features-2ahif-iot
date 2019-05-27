var timespans = [];

function timestamp(str) {
    return new Date(str).getTime();
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

var dateSlider = document.getElementById('slider-date');

noUiSlider.create(dateSlider, {
    range: {
        min: timestamp('2019-05-06'),
        max: timestamp('2019-06-01')
    },
    step: 24 * 60 * 60 * 1000,
    start: [timestamp('2019-05-06'), timestamp('2019-05-08')],
    format: wNumb({
        decimals: 0
    })
});

var dateValues = [
    document.getElementById('event-start'),
    document.getElementById('event-end')
];

function printChart() {
       fetch('http://heating.wllgrsrv.cf/?from=' + dateValues[0].innerHTML + '&to=' + dateValues[1].innerHTML)
     .then(response => {
         if (!response.ok) {
             throw new Error("HTTP error " + response.status);
         }
         return response.json();
     })
     .then(jsonanswer => {
        timespans = [];
        for (var i = 0; i < jsonanswer.length; i++) {
            // var date = new Date(dateString);
            timespans.push(jsonanswer[i]["TIMESTAMP"]);
        }
        console.log(jsonanswer);
     })
     .catch(function () {
         this.dataError = true;
     });

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

    var outsideData = [];
    var heatingFlowData = [];
    var returnFlowData = [];
    var warmWaterData = [];

    var ctx = document.getElementById("tempChart").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [timespans[0], timespans[timespans.length - 1]],
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
    dateValues = [
        document.getElementById('event-start'),
        document.getElementById('event-end')
    ];

    printChart();
});

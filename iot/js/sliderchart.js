var timespans;
var outsideData;
var heatingFlowData;
var returnFlowData;
var warmWaterData;

var outsideTemperatures = [];
var heatingFlowTemperatures = [];
var returnFlowTemperatures = [];
var warmWaterTemperatures = [];

var chart;

function timestamp(str) {
    return new Date(str).getTime();
}

function getTodayDateString()
{
    var today = new Date();
    var dd = String(today.getDate() + 1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
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
        max: timestamp(getTodayDateString())
    },
    step: 24 * 60 * 60 * 1000,
    start: [timestamp('2019-06-07'), timestamp(getTodayDateString())],
    format: wNumb({
        decimals: 0
    })
});

var dateValues = [
    document.getElementById('event-start'),
    document.getElementById('event-end')
];

async function printChart() {
    document.getElementById("message").innerHTML = '<span class="badge badge-success">Die Daten werden geladen...</span><br>';
    await fetch('http://heating.wllgrsrv.cf/?from=' + dateValues[0].innerHTML + '&to=' + dateValues[1].innerHTML)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(jsonanswer => {
            timespans = [];
            outsideTemperatures = [];
            heatingFlowTemperatures = [];
            returnFlowTemperatures = [];
            warmWaterTemperatures = [];
            outsideData = jsonanswer.filter(d => d.READING === 'Temp-Aussen');
            heatingFlowData = jsonanswer.filter(d => d.READING === 'Temp-Vorlauf');
            returnFlowData = jsonanswer.filter(d => d.READING === 'Temp-Ruecklauf');
            warmWaterData = jsonanswer.filter(d => d.READING === 'Ww-Temp');

            for (var i = 0; i <= 20; i++) {
                // var date = new Date(dateString);
                timespans.push(outsideData[Math.floor(((outsideData.length - 1) / 20) * i)]["TIMESTAMP"]);
                outsideTemperatures.push(outsideData[Math.floor(((outsideData.length - 1) / 20) * i)]["VALUE"]);
                heatingFlowTemperatures.push(heatingFlowData[Math.floor(((heatingFlowData.length - 1) / 20) * i)]["VALUE"]);
                returnFlowTemperatures.push(returnFlowData[Math.floor(((returnFlowData.length - 1) / 20) * i)]["VALUE"]);
                warmWaterTemperatures.push(warmWaterData[Math.floor(((warmWaterData.length - 1) / 20) * i)]["VALUE"]);
            }
            document.getElementById("message").innerHTML = '';
        })
        .catch(function() {
            this.dataError = true;
        });
    var data = {
        labels: [],
        datasets: [{
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

    var ctx = document.getElementById("tempChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timespans,
            datasets: [{
                data: outsideTemperatures,
                label: "Outside",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: heatingFlowTemperatures,
                label: "Heating flow",
                borderColor: "#8e5ea2",
                fill: false
            }, {
                data: returnFlowTemperatures,
                label: "Return flow",
                borderColor: "#3cba9f",
                fill: false
            }, {
                data: warmWaterTemperatures,
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
    dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));

    printChart();
});

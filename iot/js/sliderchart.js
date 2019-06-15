/*
    Slider chart
    --> Prepares, initializes and loads the chart (data).
*/

// Constants
const DATA_URL = "http://heating.wllgrsrv.cf";
const DATA_START_DATE = "2019-05-06";

var timespans;
var outsideData;
var heatingFlowData;
var returnFlowData;
var warmWaterData;

// Arrays for temp. data
var outsideTemperatures = [];
var heatingFlowTemperatures = [];
var returnFlowTemperatures = [];
var warmWaterTemperatures = [];

// Chart element (<canvas>)
var chart;

// String to timestamp
function timestamp(str) {
    return new Date(str).getTime();
}

// Formats a date object to
// YYYY-MM-DD
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

// Creates the slider
noUiSlider.create(dateSlider, {
    range: {
        min: timestamp(DATA_START_DATE),
        max: timestamp(formatDate(new Date()))
    },
    step: 24 * 60 * 60 * 1000,
    // Select 2 days before current date by default
    start: [timestamp(formatDate(new Date(new Date().setDate(new Date().getDate()-1)))),
        timestamp(formatDate(new Date()))],
    format: wNumb({
        decimals: 0
    })
});

var dateValues = [
    document.getElementById('event-start'),
    document.getElementById('event-end')
];

// Prints the chart (asynchronous)
async function printChart() {
    // Set loader to visible
    document.getElementById("message").innerHTML = '<span class="badge badge-success">Loading data...</span><br>';
    await fetch(DATA_URL + '/?from=' + dateValues[0].innerHTML + '&to=' + dateValues[1].innerHTML)
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
                timespans.push(outsideData[Math.floor(((outsideData.length - 1) / 20) * i)]["TIMESTAMP"]);
                outsideTemperatures.push(outsideData[Math.floor(((outsideData.length - 1) / 20) * i)]["VALUE"]);
                heatingFlowTemperatures.push(heatingFlowData[Math.floor(((heatingFlowData.length - 1) / 20) * i)]["VALUE"]);
                returnFlowTemperatures.push(returnFlowData[Math.floor(((returnFlowData.length - 1) / 20) * i)]["VALUE"]);
                warmWaterTemperatures.push(warmWaterData[Math.floor(((warmWaterData.length - 1) / 20) * i)]["VALUE"]);
            }
            // Set loader to invisible
            document.getElementById("message").innerHTML = '';
        })
        .catch(function() {
            this.dataError = true;
        });

    var ctx = document.getElementById("tempChart").getContext("2d");

    // Recreate chart if it was initialized before
    if (chart) {
        chart.destroy();
    }

    // Initialize the chart
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

// Create chart on update/slider change
dateSlider.noUiSlider.on('update', function(values, handle) {
    dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
});

printChart();
dateSlider.noUiSlider.on('change', function(values, handle) {
    dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
    printChart();
});
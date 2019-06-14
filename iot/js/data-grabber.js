var heatingData;
var time = "day";
var offset = "0";
var requesting = false;

function runDataGrabber() {

    fetch('https://www.wallinger-online.at/heating/')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(json => {
            heatingData = json;
            replaceData();
        })
        .catch(function() {
            this.dataError = true;
        });
}

function replaceData() {
    document.getElementById("outside-temp").innerHTML = heatingData.Results[0].Readings["Temp-Aussen"].Value + " °C";
    document.getElementById("heating-flow").innerHTML = heatingData.Results[0].Readings["Temp-Vorlauf"].Value + " °C";
    document.getElementById("return-flow").innerHTML = heatingData.Results[0].Readings["Temp-Ruecklauf"].Value + " °C";
    document.getElementById("return-flow-set").innerHTML = heatingData.Results[0].Readings["Temp-Ruecklauf-Soll"].Value + " °C";
    document.getElementById("warm-water").innerHTML = heatingData.Results[0].Readings["Ww-Temp"].Value + " °C";
    document.getElementById("evaporator").innerHTML = heatingData.Results[0].Readings["Temp-Verdampfer"].Value + " °C";
    document.getElementById("condenser").innerHTML = heatingData.Results[0].Readings["Temp-Kondensator"].Value + " °C";

    document.getElementById("mode").innerHTML = heatingData.Results[0].Readings["Betriebs-Mode"].Value;
    document.getElementById("cpu-date").innerHTML = heatingData.Results[0].Readings["CPU-Boot-Datum"].Value;
    document.getElementById("cpu-time").innerHTML = heatingData.Results[0].Readings["CPU-Boot-Zeit"].Value;
    document.getElementById("ht-inc-off").innerHTML = heatingData.Results[0].Readings["Hz-Anhebung-Aus"].Value + " - " + heatingData.Results[0].Readings["Hz-Anhebung-Ein"].Value;
    document.getElementById("ht-inc-on").innerHTML = heatingData.Results[0].Readings["Hz-Anhebung-Ein"].Value + " - " + heatingData.Results[0].Readings["Hz-Anhebung-Aus"].Value;
    document.getElementById("ht-hyst").innerHTML = heatingData.Results[0].Readings["Hz-Hysterese"].Value;
    document.getElementById("compr-hours").innerHTML = heatingData.Results[0].Readings["KomprBetrStunden"].Value;

    document.getElementById("time").innerHTML = heatingData.Results[0].Readings["Uhrzeit"].Value;
    document.getElementById("date").innerHTML = heatingData.Results[0].Readings["Datum"].Value;
}

function handleClick(myRadio) {
    time = myRadio.value;
}

function handleOffset(myTxt) {
    offset = myTxt.value;
}

runDataGrabber();
var timer = setInterval(runDataGrabber, 60 * 1000);
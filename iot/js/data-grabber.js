function runDataGrabber() {
    var heatingData = jQuery.getJSON("https://www.wallinger-online.at/heating/", null, replaceData);

    function replaceData() {
        document.getElementById("outside-temp").innerHTML = heatingData.responseJSON.Results[0].Readings["Temp-Aussen"].Value + " °C";
        document.getElementById("heating-flow").innerHTML = heatingData.responseJSON.Results[0].Readings["Temp-Vorlauf"].Value + " °C";
        document.getElementById("return-flow").innerHTML = heatingData.responseJSON.Results[0].Readings["Temp-Ruecklauf"].Value + " °C";
        document.getElementById("return-flow-set").innerHTML = heatingData.responseJSON.Results[0].Readings["Temp-Ruecklauf-Soll"].Value + " °C";
        document.getElementById("warm-water").innerHTML = heatingData.responseJSON.Results[0].Readings["Ww-Temp"].Value + " °C";
        document.getElementById("evaporator").innerHTML = heatingData.responseJSON.Results[0].Readings["Temp-Verdampfer"].Value + " °C";
        document.getElementById("condenser").innerHTML = heatingData.responseJSON.Results[0].Readings["Temp-Kondensator"].Value + " °C";

        document.getElementById("mode").innerHTML = heatingData.responseJSON.Results[0].Readings["Betriebs-Mode"].Value;
        document.getElementById("cpu-date").innerHTML = heatingData.responseJSON.Results[0].Readings["CPU-Boot-Datum"].Value;
        document.getElementById("cpu-time").innerHTML = heatingData.responseJSON.Results[0].Readings["CPU-Boot-Zeit"].Value;
        document.getElementById("ht-inc-off").innerHTML = heatingData.responseJSON.Results[0].Readings["Hz-Anhebung-Aus"].Value;
        document.getElementById("ht-inc-on").innerHTML = heatingData.responseJSON.Results[0].Readings["Hz-Anhebung-Ein"].Value;
        document.getElementById("ht-hyst").innerHTML = heatingData.responseJSON.Results[0].Readings["Hz-Hysterese"].Value;
        document.getElementById("compr-hours").innerHTML = heatingData.responseJSON.Results[0].Readings["KomprBetrStunden"].Value;

        document.getElementById("last-request").innerHTML = heatingData.responseJSON.Results[0].Readings["Zeit"].Value;
    }
}

runDataGrabber();
var timer = setInterval(runDataGrabber, 60 * 1000);

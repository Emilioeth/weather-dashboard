
let city = ""
var searchCity = $("#city-input");
var clearButton = $("#clear-btn");
var currentCity = $("#city-result");
var currentTemperature = $("#current-temp");
var currentHumidty = $("#current-hum");
var currentWSpeed = $("#current-wind");
var currentUvindex = $("#current-uv");
var sCity = [];

var APIKey = "c6079cfc6ca681783c9a78f441ac216e";

function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

function addToList(c) {
    var listEl = $("<button>" + c.toUpperCase() + "</button>");
    $(listEl).attr("class", "options-box");
    $(listEl).attr("data-value", c.toUpperCase());
    $("#user-history-list").append(listEl);
}

function invokePastSearch(event) {
    var btnEl = event.target;
    if (event.target.matches("button")) {
        city = btnEl.textContent.trim();
        currentWeather(city);
    }

}

function loadlastCity() {
    var sCity = JSON.parse(localStorage.getItem("weather-city-name"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("weather-city-name"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}

function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("weather-city-name");
    document.location.reload();
}



$("#search-btn").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-btn").on("click", clearHistory);

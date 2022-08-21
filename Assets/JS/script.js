
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

function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        var weatherIcon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        
        var date = new Date(response.dt * 1000).toLocaleDateString();

        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");
        
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
        
        $(currentHumidty).html(response.main.humidity + "%");
 
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWSpeed).html(windsmph + "MPH");
        forecast(response.coord.lon, response.coord.lat);
  
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("weather-city-name"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("weather-city-name", JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("weather-city-name", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }
    });
}

function forecast(lon, lat) {

    var queryforcastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${APIKey}`


    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function (response) {
        var currentUVIndexValue = response.current.uvi;
        $(currentUvindex).html(currentUVIndexValue);

        for (i = 0; i < 5; i++) {
            var date = new Date((response.daily[i].dt) * 1000).toLocaleDateString();
            var iconCode = response.daily[i].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            var tempF = response.daily[i].temp.max;
            var humidity = response.daily[i].humidity;
            var wind = response.daily[i].wind_speed + ' mph';

            $("#date5-" + (i + 1)).html(date);
            $("#day5-img" + (i + 1)).html("<img src=" + iconUrl + ">");
            $("#day5-wind" + (i + 1)).html(wind);
            $("#day5-temp" + (i + 1)).html(tempF + "&#8457");
            $("#day5-humid" + (i + 1)).html(humidity + "%");
        }
    });
}

$("#search-btn").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-btn").on("click", clearHistory);

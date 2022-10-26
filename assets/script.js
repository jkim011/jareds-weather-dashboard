var myApi = "d6361e33fcfedca88429bd0a3af18cff"
var today = document.querySelector(".today")
var forecastContainer = document.querySelector(".forecast-container")
let cityInput = document.getElementById("search-city")
var searchBtn = document.getElementById("search-btn")
const searchTerm = cityInput.value.trim()


// Clears previous city's info from the screen
function clearScreen () {
    $("#five-days").empty()
}

// Search button to activate weather functions and add to search history
searchBtn.addEventListener("click", function () {
    today.classList.remove("hide")
    forecastContainer.classList.remove("hide")
    clearScreen()
    getWeather(searchTerm)
    getForecast(searchTerm)
    saveSearch(searchTerm)
    getSearch(searchTerm)
})

// Function to fetch today's weather 
function getWeather() {

    const searchTerm = cityInput.value
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&units=imperial&appid=" + myApi

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Shows current date and time
        var currentDay = null
        var date = null

        var updateDay = function() {
            date = moment(new Date())
            currentDay.text(date.format("L"))
        }

        $(document).ready(function(){
            currentDay = $("#show-date")
            updateDay()
            setInterval(updateDay, 1000)
        })

        // Displays today's weather
        const showCity = document.getElementById("show-city")
        const showTemp = document.getElementById("show-temp")
        const showWind = document.getElementById("show-wind")
        const showHumidity = document.getElementById("show-humidity")

        showCity.innerHTML = data.name
        showTemp.innerHTML = "Temperature: " + data.main.temp + " °F"
        showWind.innerHTML = "Wind: " + data.wind.speed + " mph"
        showHumidity.innerHTML = "Humidity: " + data.main.humidity + " %"
        console.log(data)

        // Displays icon of weather condition
        const todayIcon = document.getElementById("icon")
        let weatherIcon = data.weather[0].icon
        todayIcon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherIcon + ".png")    
    })
}

// Function to fetch 5 day forecast
function getForecast() {

    const searchTerm = cityInput.value
    var requestForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&units=imperial&appid=" + myApi
    
    fetch(requestForecastUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        var forecast = data.list
        console.log(forecast)
        
        // for loop will loop thru the next 5 days forecast
        for (i = 5; i < forecast.length; i = i+8) {   
            var fiveDays = document.getElementById("five-days")
            var dailyForecast = forecast[i]
            
            // div created to hold each of the five days forecast
            const div = document.createElement("div")
            div.classList.add("forecast-boxes")

            const forecastDates = document.createElement("h3")
            forecastDates.textContent = moment.unix(data.list[i].dt).format("L")

            const forecastIcons = document.createElement("img")
            forecastIcons.setAttribute("src", "https://openweathermap.org/img/w/" + dailyForecast.weather[0].icon + ".png") 
            
            const forecastTemps = document.createElement("p")
            forecastTemps.textContent = "Temperature: " + data.list[i].main.temp + " °F"

            const forecastWinds = document.createElement("p")
            forecastWinds.textContent = "Wind: " + data.list[i].wind.speed + " mph"

            const forecastHumidity = document.createElement("p")
            forecastHumidity.textContent = "Humidity: " + data.list[i].main.humidity + " %"

            // Appends forecast elements to the div to be displayed
            fiveDays.appendChild(div)
            div.appendChild(forecastDates) 
            div.appendChild(forecastIcons)          
            div.appendChild(forecastTemps)
            div.appendChild(forecastWinds)
            div.appendChild(forecastHumidity)
        }
    })
}

// Search history
var searchHistoryList = []
searchHistory = document.getElementById("search-history")

var saveSearch = function() {
    window.localStorage.setItem("searchTerm", JSON.stringify(searchHistoryList))
}

var getSearch = function() {
    const searchTerm = cityInput.value.trim()
    const searchedCity = document.createElement("li")
    searchedCity.textContent = searchTerm
    searchHistory.append(searchedCity)
}

document.getElementById("search-history").onclick = function() {getHistoryWeather()}
function getHistoryWeather() {
    var searchHistoryCity = JSON.parse(window.localStorage.getItem(searchHistoryList))
    getWeather(searchHistoryCity)
}  

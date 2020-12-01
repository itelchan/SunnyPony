// global parameters with default values
let apiKey = "51856297f45d5f846d74fb84ab553047";
let globalUnits = "metric";
let globalCityTempC = 25;
let globalCityTempF = calculateFahrenheit(globalCityTempC);
let globalWindSpeedms = 2;
let globalWindSpeedMH = calculateMilesPerHour(globalWindSpeedms);

let days = [
  "Sunday",
  "Monday",
  "Tueday",
  "Wednsday",
  "Thursday",
  "Friday",
  "Saturday"
];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

displayCurrentDate();

function calculateFahrenheit(centigrades) {
  return Number(centigrades) * (9 / 5) + 32;
}

function calculateCentigrades(fahrenheit) {
  return (Number(fahrenheit) - 32) * (5 / 9);
}

function calculateMilesPerHour(speedMetersPerSecond) {
  return speedMetersPerSecond * 2.237;
}

function calculateMeterPerSecond(speedMilesPerHour) {
  return speedMilesPerHour / 2.237;
}
//////////// DATE CALCULATION //////////////////////
function formatTime(timeNumber) {
  if (timeNumber < 10) {
    return `0${timeNumber}`;
  } else {
    return `${timeNumber}`;
  }
}

function calculateCurrentDate() {
  let now = new Date();
  let month = months[now.getMonth()];
  let day = days[now.getDay()];
  let hours = Number(now.getHours());
  let minutes = Number(now.getMinutes());

  return `${day} ${now.getDate()} ${month} ${formatTime(hours)}:${formatTime(
    minutes
  )}`;
}




////// DATE CALCULATION Epoch Converter - Unix Timestamp Converter - with ms since 1970  ////////
function formatDateUnix(timestamp)
{
  let date = new Date(timestamp);
  let hours =  date.getHours();
  let minutes = date.getMinutes();
  let day = days[date.getDate()];
  
  return `${day} ${date.getDate()}  ${formatTime(hours)}:${formatTime(minutes)}`;
}


///////////////////////      TEMP CALCULATION      ////////////////////////////

// check the current unit and calculate from one unit to another
function changeUnits() {
  determineTempUnits();

  let tempDisplay = document.querySelector("#displayTemp");
  let windDisplay = document.querySelector("#displayCurrentWindSpeed");

  if (globalUnits === "metric") {
    tempDisplay.innerHTML = `${Math.round(globalCityTempC)} °C`;
    windDisplay.innerHTML = `Wind ${Math.round(globalWindSpeedms)} m/s`;
  } else if (globalUnits === "imperial") {
    tempDisplay.innerHTML = `${Math.round(globalCityTempF)} °F`;
    windDisplay.innerHTML = `Wind ${Math.round(globalWindSpeedMH)} Miles/H`;
  } else {
    // leave the default temperature
  }
}

// The temperature was already provided in centigrades or in fahrenheit
function displayTemperatureWithUnits(temperatureCity, units) {
  let tempDisplay = document.querySelector("#displayTemp");

  if (units === "metric") {
    globalCityTempC = temperatureCity;
    globalCityTempF = calculateFahrenheit(globalCityTempC);
    tempDisplay.innerHTML = `${Math.round(temperatureCity)} °C`;
  } else if (units === "imperial") {
    globalCityTempC = calculateCentigrades(globalCityTempF);
    globalCityTempF = temperatureCity;
    tempDisplay.innerHTML = `${Math.round(temperatureCity)} °F`;
  } else {
    // leave the default temperature
  }
}

function determineTempUnits() {
  let radioButtons = document.querySelectorAll('input[name="grades"]');
  let selectedUnit;
  for (const rb of radioButtons) {
    if (rb.checked) {
      selectedUnit = rb.value;
      break;
    }
  }
  globalUnits = selectedUnit; // set the global variable
}
///////////////////////      DISPLAY CALCULATED PARAMETERS   ////////////////////////////
function displayCityName(cityName) {
  let cityDisplay = document.querySelector("#displayCity");
  cityDisplay.innerHTML = cityName;
}

function displayCountryName(countryName) {
  let displayCountry = document.querySelector("#displayCountry");
  displayCountry.innerHTML = countryName;
}

function displayWeatherState(wCondit) {
  let displayWeatherCond = document.querySelector("#displayWeatherConditions");
  displayWeatherCond.innerHTML = wCondit;
}

function displayWindSpeed(wind) {
  let displayWind = document.querySelector("#displayCurrentWindSpeed");

  if (globalUnits === "imperial") {
    displayWind.innerHTML = `Wind ${Math.round(wind)} Miles/H`;
    globalWindSpeedMH = wind;
    globalWindSpeedms = calculateMeterPerSecond(wind);
  } else {
    displayWind.innerHTML = `Wind ${Math.round(wind)} m/s`;
    globalWindSpeedms = wind;
    globalWindSpeedMH = calculateMilesPerHour(wind);
  }
}

function displayCurrentHumidity(humidity) {
  let displayHumidity = document.querySelector("#displayCurrentHumidity");
  displayHumidity.innerHTML = `Humidity: ${humidity}%`;
}

function displayCurrentDate(){
  let currentDate = document.querySelector("#currentDate");
  currentDate.innerHTML = calculateCurrentDate();
}

// Call it like this:  displayLastUpdatedResponseDate(response.data.dt);
function displayLastUpdatedResponseDate(mseconds){
  let currentDate = document.querySelector("#currentDate");
  let latestUpdate = formatDateUnix(mseconds *1000);
  console.log(latestUpdate);
  currentDate.innerHTML = latestUpdate;
}
////////////////////////////////////////////////////////////////////////////////

function displayTempAndWeatherToUserFromResponse(response) {
  displayCityName(response.data.name);
  displayCountryName(response.data.sys.country);
  displayWeatherState(response.data.weather[0].description);
  displayTemperatureWithUnits(response.data.main.temp, globalUnits);
  displayWindSpeed(response.data.wind.speed);
  displayCurrentHumidity(response.data.main.humidity);
  displayCurrentDate();

  
}

function calculateURLWithSearchedCity(cityName) {
  determineTempUnits();
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${globalUnits}`;
  axios.get(url).then(displayTempAndWeatherToUserFromResponse);
}

function getCity(event) {
  event.preventDefault();
  let cityFromUserTrim = "Mexico City"; // default value

  let inputCity = document.querySelector("#inputCity1");
  if (inputCity.value !== null && inputCity.value.length !== 0) {
    cityFromUserTrim = inputCity.value.trim();
  }

  calculateURLWithSearchedCity(cityFromUserTrim);
}

let sunnyPonyForm = document.querySelector("#sunnyPonyForm");
sunnyPonyForm.addEventListener("submit", getCity);

////////////////////// Change units calculation //////////////////////

let centigradeRadioButton = document.querySelector("#COption");
let fahrenheitRadioButton = document.querySelector("#FOption");

centigradeRadioButton.addEventListener("click", changeUnits);
fahrenheitRadioButton.addEventListener("click", changeUnits);

////////////////// Current Position calculations ///////////

function calculateURLWithCurrentPosition(position) {
  let currentLat = position.coords.latitude;
  let currentLon = position.coords.longitude;

  determineTempUnits();
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}&units=${globalUnits}`;
  axios.get(url).then(displayTempAndWeatherToUserFromResponse);
}

function getCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(calculateURLWithCurrentPosition);
}

let currentLoButton = document.querySelector("#currentLocButton");
currentLoButton.addEventListener("click", getCurrentCity);

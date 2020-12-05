// global parameters with default values
let apiKey = "51856297f45d5f846d74fb84ab553047";
let globalUnits = "metric";

let globalWindSpeedms = 2;
let globalWindSpeedMH = calculateMilesPerHour(globalWindSpeedms);

let globalCityTempC = [25];
let globalCityTempF = [calculateFahrenheit(globalCityTempC)];
let globalFforecastMin = [0, 0, 0, 0, 0];
let globalCforecastMin = [0, 0, 0, 0, 0];
let globalFforecastMax = [0, 0, 0, 0, 0];
let globalCforecastMax = [0, 0, 0, 0, 0];

let globalHour = 0;

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let littleDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  "Dec",
];

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
  //For the week forecast we need the current hour to find the optimal position of the next day
  globalHour = hours;

  return `${day} ${now.getDate()} ${month} ${formatTime(hours)}:${formatTime(
    minutes
  )}`;
}

////// DATE CALCULATION Epoch Converter - Unix Timestamp Converter - with ms since 1970  ////////
function formatDateUnix(timestamp) {
  let dateT = new Date(timestamp);
  let hoursT = dateT.getHours();
  let minutesT = dateT.getMinutes();
  //console.log(dateT.getDay());
  let dayT = days[dateT.getDay()];

  return `${dayT} ${dateT.getDate()}  ${formatTime(hoursT)}:${formatTime(
    minutesT
  )}`;
}

///////////////////////      TEMP CALCULATION      ////////////////////////////

// check the current unit and calculate from one unit to another
function changeUnits() {
  determineTempUnits();

  let tempDisplay = document.querySelector("#globalCityTemp");
  let windDisplay = document.querySelector("#displayCurrentWindSpeed");

  if (globalUnits === "metric") {
    tempDisplay.innerHTML = `${Math.round(globalCityTempC)} °C`;
    windDisplay.innerHTML = `${Math.round(globalWindSpeedms)} m/s`;

    console.log("metric");
    for (
      let dayNumberToForecast = 0;
      dayNumberToForecast < 5;
      dayNumberToForecast++
    ) {
      let forecastMinTempId = document.querySelector(
        "#forecastMin" + dayNumberToForecast
      );
      let forecastMaxTempId = document.querySelector(
        "#forecastMax" + dayNumberToForecast
      );
      console.log(dayNumberToForecast);
      forecastMinTempId.innerHTML = `${Math.round(
        globalCforecastMin[dayNumberToForecast]
      )} °C`;
      forecastMaxTempId.innerHTML = `${Math.round(
        globalCforecastMax[dayNumberToForecast]
      )} °C`;
    }
  } else if (globalUnits === "imperial") {
    tempDisplay.innerHTML = `${Math.round(globalCityTempF)} °F`;
    windDisplay.innerHTML = `${Math.round(globalWindSpeedMH)} Miles/H`;
    console.log("imperial");
    for (
      let dayNumberToForecast = 0;
      dayNumberToForecast < 5;
      dayNumberToForecast++
    ) {
      let forecastMinTempId = document.querySelector(
        "#forecastMin" + dayNumberToForecast
      );
      let forecastMaxTempId = document.querySelector(
        "#forecastMax" + dayNumberToForecast
      );

      forecastMinTempId.innerHTML = `${Math.round(
        globalFforecastMin[dayNumberToForecast]
      )} °F`;
      forecastMaxTempId.innerHTML = `${Math.round(
        globalFforecastMax[dayNumberToForecast]
      )} °F`;
    }
  } else {
    // leave the default temperature
  }
}

// The temperature was already provided in centigrades or in fahrenheit
function displayTemperatureWithUnits(
  temp,
  idHTML,
  globalVariableC,
  gloabalVariableF,
  index
) {
  let tempDisplay = document.querySelector(`#${idHTML}`);

  if (globalUnits === "metric") {
    globalVariableC[index] = temp;
    gloabalVariableF[index] = calculateFahrenheit(globalVariableC[index]);
    tempDisplay.innerHTML = `${Math.round(temp)} °C`;
  } else if (globalUnits === "imperial") {
    globalVariableC[index] = calculateCentigrades(gloabalVariableF[index]);
    gloabalVariableF[index] = temp;
    tempDisplay.innerHTML = `${Math.round(temp)} °F`;
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
    displayWind.innerHTML = `${Math.round(wind)} Miles/H`;
    globalWindSpeedMH = wind;
    globalWindSpeedms = calculateMeterPerSecond(wind);
  } else {
    displayWind.innerHTML = `${Math.round(wind)} m/s`;
    globalWindSpeedms = wind;
    globalWindSpeedMH = calculateMilesPerHour(wind);
  }
}

function displayCurrentHumidity(humidity) {
  let displayHumidity = document.querySelector("#displayCurrentHumidity");
  displayHumidity.innerHTML = `${humidity}%`;
}

function displayCurrentDate() {
  let currentDate = document.querySelector("#currentDate");
  currentDate.innerHTML = calculateCurrentDate();
}

function displayWheatherIcon(iconName) {
  let currentIcon = document.querySelector("#displayCurrentWeatherImage");
  currentIcon.setAttribute(
    "src",
    //`http://openweathermap.org/img/wn/${iconName}@2x.png`  // image from openweathermap
    `images/${iconName}.svg` // My image
  );
}

function displayForcastedWheatherIcon(day, iconName) {
  let currentIcon = document.querySelector("#forecastWeatherImage" + day);
  currentIcon.setAttribute(
    "src",
    //`http://openweathermap.org/img/wn/${iconName}@2x.png`   // image from openweathermap
    `images/${iconName}.svg` // My image
  );
}

// Call it like this:  displayLastUpdatedResponseDate(response.data.dt);
function displayLastUpdatedResponseDate(mseconds) {
  let currentDate = document.querySelector("#currentDate");
  let latestUpdate = formatDateUnix(mseconds * 1000);
  currentDate.innerHTML = latestUpdate;
}

function displayForecastDayName(dayNumberToForecast, timestamp) {
  //Calculate the day to be updated
  let idName = "#forecastNameDay" + dayNumberToForecast;
  let dayName = document.querySelector(idName);

  //Get the number of the corresponding name
  let dateD = new Date(timestamp * 1000);
  let dayD = dateD.getDay();

  // seach fo the day abbreviation in the array
  let calcShortName = littleDays[dayD];
  dayName.innerHTML = calcShortName;
}

function displayForecastMinMax(dayNumberToForecast, listPosition, response) {
  let forecastMinTempId = "forecastMin" + dayNumberToForecast;
  let forecastMaxTempId = "forecastMax" + dayNumberToForecast;

  // Considering listPosition the first element of the next following day
  let calcMin = +100;
  let calcMax = -100;
  let numberOfDaysMeasured = 0;
  let maximumNumberOfMeasurementsPerDay = 7;

  for (let i = listPosition; i < 40; i++) {
    if (numberOfDaysMeasured < maximumNumberOfMeasurementsPerDay) {
      // find out if the newest minimum temperature is lower than the last measurement
      let newMin = response.data.list[i].main.temp_min;
      calcMin > newMin ? (calcMin = newMin) : calcMin;
      // console.log( `---response: ${response.data.list[i].main.temp_min}  calcMin: ${calcMin} `);

      // find out if the newest minimum temperature is higher than the last measurement
      let newMax = response.data.list[i].main.temp_max;
      calcMax < newMax ? (calcMax = newMax) : calcMax;
      //console.log(`---response: ${response.data.list[i].main.temp_max}  calcMax: ${calcMax} `);

      numberOfDaysMeasured++;
    } else {
      break;
    }
  }

  // update min and max of the corresponding day
  displayTemperatureWithUnits(
    calcMin,
    forecastMinTempId,
    globalCforecastMin,
    globalFforecastMin,
    dayNumberToForecast
  );
  displayTemperatureWithUnits(
    calcMax,
    forecastMaxTempId,
    globalCforecastMax,
    globalFforecastMax,
    dayNumberToForecast
  );
}

////////////////////////////////////////////////////////////////////////////////

function displayTempAndWeatherToUserFromResponse(response) {
  displayCityName(response.data.name);
  displayCountryName(response.data.sys.country);
  displayWeatherState(response.data.weather[0].description);
  displayTemperatureWithUnits(
    response.data.main.temp,
    "globalCityTemp",
    globalCityTempC,
    globalCityTempF,
    0
  );
  displayWindSpeed(response.data.wind.speed);
  displayCurrentHumidity(response.data.main.humidity);
  displayCurrentDate();
  displayWheatherIcon(response.data.weather[0].icon);
}

function calculateForecastPositionForTomorrow() {
  // Move 1 position to be sure we are in the next day
  let position = Math.round((24 - globalHour) / 3) + 1;
  return position;
}

function displayForecastFromResponse(response) {
  console.log(response.data);
  let forecastedDay = 0;
  let calculatedDay = 0;
  let i = 0;
  let offsetToNextDay = 8;
  let midDayOffset = 3; // change to 2 or 3 , depending whats more interesting
  for (
    i = calculateForecastPositionForTomorrow();
    i < 40;
    i = i + offsetToNextDay
  ) {
    console.log(`i: ${i}, forecastedDay: ${forecastedDay} `);
    let timestamp = response.data.list[i].dt;
    displayForecastDayName(forecastedDay, timestamp);
    displayForecastMinMax(forecastedDay, i, response);
    console.log(response.data.list[i + midDayOffset]);
    displayForcastedWheatherIcon(
      forecastedDay,
      response.data.list[i + midDayOffset].weather[0].icon
    );
    forecastedDay++;
  }

  //Special case if the offset for day 5 exceeds 40, which is the max of the list
  if(forecastedDay < 5)
  {
    let listLenght = 40;
    let timestamp = response.data.list[listLenght-1].dt;
    
    //Calculate the day to be updated
    let dayName = document.querySelector("#forecastNameDay4");
    //Get the number of the corresponding name
    let dateD = new Date(timestamp * 1000);
    // update to the next day name
    dayName.innerHTML = littleDays[dateD.getDay() + 1];

    displayForecastMinMax(forecastedDay, listLenght -1, response);
    displayForcastedWheatherIcon(
      forecastedDay,
      response.data.list[listLenght-1].weather[0].icon
    );
  }
}

function calculateURLWithSearchedCity(cityName) {
  determineTempUnits();
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${globalUnits}`;
  axios.get(url).then(displayTempAndWeatherToUserFromResponse);

  let forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${globalUnits}`;
  console.log(forecasturl);
  axios.get(forecasturl).then(displayForecastFromResponse);
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
  let currenturl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}&units=${globalUnits}`;
  axios.get(currenturl).then(displayTempAndWeatherToUserFromResponse);

  let forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}&units=${globalUnits}`;
  console.log(forecasturl);
  axios.get(forecasturl).then(displayForecastFromResponse);
}

function getCurrentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(calculateURLWithCurrentPosition);
}

let currentLoButton = document.querySelector("#currentLocButton");
currentLoButton.addEventListener("click", getCurrentCity);

// When loaded for the first time , load Mexico City as default
calculateURLWithSearchedCity("Mexico City");

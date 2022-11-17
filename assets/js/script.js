var searchBtn = document.querySelector("#search");
var input = document.querySelector("#search-input");

var storedSearches = [];

var locationUrl = "https://api.openweathermap.org/geo/1.0/direct";
var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast";

function init() {
  storedSearches = [];
}

var getLocation = function (event) {
  event.preventDefault();

  const city = document.querySelector("#search-input").value;

  if (!city) {
    console.error("You need a search input value!");
    return;
  }

  saveSearch(city);
  renderSearches();

  var cityUrl = locationUrl + "?q=" + city + "&limit=5&appid=" + key;

  fetch(cityUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data[0].lat) {
        console.error("Can't find city!");
        return;
      }

      var latitude = data[0].lat;
      var longitude = data[0].lon;
      getWeather(latitude, longitude);
      clearInput();
    });
};

function getWeather(latitude, longitude) {
  var coordinateUrl =
    weatherUrl +
    "?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&exclude=minutely,hourly&appid=" +
    key;
  fetch(coordinateUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderCurrentDay(data);
      renderFiveDay(data);
    });
}

function renderCurrentDay(data) {
  removeCurrentDay();
  const divEl = document.querySelector("#current-day");
  const city = data.city.name;
  const date = moment(data.list[0].dt_txt).format("MM/DD/YYYY");
  const temp = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const wind = data.list[0].wind.speed;
  const iconCode = data.list[0].weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  divEl.setAttribute("class", "current-day");
  const cityEl = document.createElement("h2");
  const iconEl = document.createElement("img");
  const listEl = document.createElement("ul");
  const tempEl = document.createElement("li");
  const humidityEl = document.createElement("li");
  const windEl = document.createElement("li");
  tempEl.textContent = "Temp: " + temp + "°F";
  windEl.textContent = "Wind: " + wind + " MPH";
  humidityEl.textContent = "Humidity: " + humidity + "%";
  cityEl.textContent = city + " (" + date + ") ";
  iconEl.setAttribute("src", iconUrl);
  cityEl.appendChild(iconEl);
  divEl.appendChild(cityEl);
  listEl.appendChild(tempEl);
  listEl.appendChild(windEl);
  listEl.appendChild(humidityEl);
  divEl.appendChild(listEl);
}

function renderFiveDay(data) {
  removeFiveDay();
  const cardEl2 = document.querySelector("#title");
  cardEl2.textContent = "5-Day Forecast:";
  for (let i = 7; i < 40; i += 8) {
    const day = "#day" + i;
    const cardEl = document.querySelector(day);
    cardEl.setAttribute("class", "card");
    const date = moment(data.list[i].dt_txt).format("MM/DD/YYYY");
    const temp = data.list[i].main.temp;
    const humidity = data.list[i].main.humidity;
    const wind = data.list[i].wind.speed;
    const iconCode = data.list[i].weather[0].icon;
    const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    const dateEl = document.createElement("h5");
    const iconEl = document.createElement("p");
    const iconEl1 = document.createElement("img");
    const tempEl = document.createElement("p");
    const humidityEl = document.createElement("p");
    const windEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + "°F";
    windEl.textContent = "Wind: " + wind + " MPH";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    dateEl.textContent = date;
    dateEl.setAttribute("font-weight", "bolder");
    iconEl1.setAttribute("src", iconUrl);
    iconEl.appendChild(iconEl1);
    cardEl.appendChild(dateEl);
    cardEl.appendChild(iconEl);
    cardEl.appendChild(tempEl);
    cardEl.appendChild(windEl);
    cardEl.appendChild(humidityEl);
  }
}

function saveSearch(city) {
  storedSearches.push(city);
  localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
}

function renderSearches() {
  removeSearches();
  if (storedSearches) {
    const storedSearchs = JSON.parse(localStorage.getItem("storedSearchs"));
    const searchList = document.querySelector("#recent-searches");
    for (j = 0; j < storedSearches.length; j++) {
      const item = document.createElement("span");
      const searchItem = document.createElement("button");
      searchItem.textContent = storedSearches[j];
      searchItem.setAttribute("class", "submit-btn");
      searchItem.setAttribute("id", "search");
      searchItem.setAttribute("value", storedSearches[j]);
      item.appendChild(searchItem);
      searchList.appendChild(item);
      searchItem.addEventListener("click", resultBtn);
    }
  } else {
    return;
  }
}

var resultBtn = function (e) {
  const city = e.target.value;
  console.log(city);

  if (!city) {
    return;
  }

  var cityUrl = locationUrl + "?q=" + city + "&limit=5&appid=" + key;

  fetch(cityUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data[0].lat) {
        console.error("Can't find city!");
        return;
      }

      var latitude = data[0].lat;
      var longitude = data[0].lon;
      getWeather(latitude, longitude);
      clearInput();
    });
};

function removeSearches() {
  const searchList1 = document.querySelector("#recent-searches");
  while (searchList1.hasChildNodes()) {
    searchList1.removeChild(searchList1.firstChild);
  }
}

function removeFiveDay() {
  for (let i = 7; i < 40; i += 8) {
    const day = "#day" + i;
    const cardEl3 = document.querySelector(day);
    while (cardEl3.hasChildNodes()) {
      cardEl3.removeChild(cardEl3.firstChild);
    }
  }
}

function removeCurrentDay() {
  const divEl2 = document.querySelector("#current-day");
  while (divEl2.hasChildNodes()) {
    divEl2.removeChild(divEl2.firstChild);
  }
}

function clearInput() {
  input.value = "";
}

init();
searchBtn.addEventListener("submit", getLocation);

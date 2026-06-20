// OpenWeather API Key
const API_KEY = "cb4a7b3be6522f16764252774dd3d20e";

// Elements

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherInfo = document.getElementById("weatherInfo");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const suggestions = document.getElementById("suggestions");
const weatherIcon = document.getElementById("weatherIcon");
const currentDate = document.getElementById("currentDate");
const searchHistory =
document.getElementById("searchHistory");
const currentTime = document.getElementById("currentTime");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

// Fetch Weather

async function getWeather(city) {

    try {

        loading.classList.remove("hidden");
        error.classList.add("hidden");
        weatherInfo.classList.add("hidden");

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

displayWeather(data);

saveSearch(city);

try{
    await getForecast(city);
}catch(err){
    console.log("Forecast Error:", err);
}
        

    } catch (err) {

        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

    }
}

// CHange Theme

const themeToggle = document.getElementById("themeToggle");

document.body.classList.add("dark");

themeToggle.addEventListener("click", () => {

    if (document.body.classList.contains("dark")) {

        document.body.classList.remove("dark");
        document.body.classList.add("light");

        themeToggle.textContent = "🌙 Dark Mode";

    } else {

        document.body.classList.remove("light");
        document.body.classList.add("dark");

        themeToggle.textContent = "☀️ Light Mode";
    }

});
// Display Weather

function displayWeather(data) {

    error.classList.add("hidden");

    cityName.textContent = data.name;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    
        condition.textContent =
    data.weather[0].description;

const weatherMain = data.weather[0].main;

if (weatherMain === "Clear") {

    document.body.style.background =
    "linear-gradient(135deg, #f59e0b, #fbbf24)";

}
else if (weatherMain === "Clouds") {

    document.body.style.background =
    "linear-gradient(135deg, #64748b, #94a3b8)";

}
else if (weatherMain === "Rain") {

    document.body.style.background =
    "linear-gradient(135deg, #2563eb, #1e3a8a)";

}
else if (weatherMain === "Drizzle") {

    document.body.style.background =
    "linear-gradient(135deg, #0ea5e9, #0284c7)";

}
else if (weatherMain === "Thunderstorm") {

    document.body.style.background =
    "linear-gradient(135deg, #111827, #000000)";

}
else {

    document.body.style.background =
    "linear-gradient(135deg, #0f172a, #1e293b)";

}

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${data.wind.speed} m/s`;
        // Date
const now = new Date();

currentDate.textContent =
now.toLocaleDateString();

// Time
currentTime.textContent =
now.toLocaleTimeString();

// Sunrise
const sunriseTime =
new Date(data.sys.sunrise * 1000);

sunrise.textContent =
sunriseTime.toLocaleTimeString();

// Sunset
const sunsetTime =
new Date(data.sys.sunset * 1000);

sunset.textContent =
sunsetTime.toLocaleTimeString();
          

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherInfo.classList.remove("hidden");
}



// Search Button

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
    }

});



//City suggestion

cityInput.addEventListener("input", async () => {

    const city = cityInput.value.trim();

    if(city.length < 2){
        suggestions.innerHTML = "";
        return;
    }

    const url =
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    suggestions.innerHTML = "";

    data.forEach(item => {

        const li =
        document.createElement("li");

        li.textContent =
        `${item.name}, ${item.country}`;

        li.addEventListener("click", () => {

            cityInput.value = item.name;

            suggestions.innerHTML = "";

            getWeather(item.name);
        });

        suggestions.appendChild(li);

    });

});
//Ftech forecat

async function getForecast(city){

    const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    displayForecast(data);

}


//display Forecast


    function displayForecast(data){

    if(!data.list){
        return;
    }

    const forecast =
    document.getElementById("forecast");

    

    const forecastTitle =
    document.getElementById("forecastTitle");

    forecast.innerHTML = "";

   const days = [];

for(let i = 0; i < data.list.length; i += 8){

    if(days.length === 5){
        break;
    }

    if(data.list[i]){
        days.push(data.list[i]);
    }

}
        
    

    days.forEach(day => {

        const date =
        new Date(day.dt_txt);

        forecast.innerHTML += `
        <div class="forecast-card">

            <h4>
                ${date.toLocaleDateString(
                    "en-US",
                    {
                        weekday:"short"
                    }
                )}
            </h4>

            <img
            src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="forecast">

            <p>
                ${Math.round(day.main.temp)}°C
            </p>

            <small>
                ${day.weather[0].main}
            </small>

        </div>
        `;

    });

    forecastTitle.classList.remove("hidden");
    forecast.classList.remove("hidden");

}





//location button
const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getWeatherByLocation(lat, lon);

        },
        () => {
            alert("Location access denied");
        }
    );

});
//Fetch Weather by location
async function getWeatherByLocation(lat, lon) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

displayWeather(data);

await getForecast(data.name);


    } catch (err) {

        console.log(err);

    }

}

// Enter Key Support

cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city !== "") {
            getWeather(city);
        }
    }
});
const lastCity =
localStorage.getItem("lastCity");

if(lastCity){

    getWeather(lastCity);

}else{

    getWeather("Chennai");

}

function saveSearch(city){

    let cities =
    JSON.parse(localStorage.getItem("cities")) || [];

    if(!cities.includes(city)){

        cities.unshift(city);

        if(cities.length > 5){
            cities.pop();
        }

        localStorage.setItem(
            "cities",
            JSON.stringify(cities)
        );
    }

    loadSearchHistory();
}
//Load search history
function loadSearchHistory(){

    let cities =
    JSON.parse(localStorage.getItem("cities")) || [];

    searchHistory.innerHTML = "";

    cities.forEach(city => {

        const li =
        document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", () => {
            getWeather(city);
        });

        searchHistory.appendChild(li);

    });

}
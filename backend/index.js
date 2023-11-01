const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());

// Load environment variables from .env file
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.use(bodyParser.json());

// Create a function to fetch weather for a city
// we can make util folder and put this function in it for better structure
async function getWeather(city) {
  console.log(`Fetching weather for ${city} : ${apiKey}`);
  const url = `https://open-weather13.p.rapidapi.com/city/${city}`;
  const options = {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "open-weather13.p.rapidapi.com",
    },
  };
  const response = await axios.get(url, options);
  const temperatureC = Math.round(((response.data.main.temp - 32) * 5) / 9); // Convert from Kelvin to Celsius
  return `${temperatureC}°C`;
}

// Create a POST endpoint to get weather for multiple cities
// we can make routes folder and put this route in it for better structure
app.post("/getWeather", async (req, res) => {
  const cities = req.body.cities;
//   console.log(`Fetching weather for ${cities}`);
  const weatherData = {};

  for (const city of cities) {
    try {
      const temperature = await getWeather(city);
    //   console.log(`Got weather for ${city}: ${temperature}`);
      weatherData[city] = temperature;
    } catch (error) {
      console.error(`Error fetching weather for ${city}: ${error.message}`);
      weatherData[city] = "N/A";
    }
  }

  res.json({ weather: weatherData });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

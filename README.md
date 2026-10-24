# WeatherMap

A single-page weather application built with pure HTML, CSS and vanilla JavaScript. The user types a city name, and the app finds its location, fetches the current weather, and shows the result in a popup on an interactive map, all without reloading the page.

**Live demo:** [your GitHub Pages link]

## Features

- Search any city by name (Arabic or English)
- Interactive map centered on Khartoum by default
- Smooth map animation to the searched city
- Marker with a weather popup: temperature, humidity, wind speed, cloud cover and weather icon
- Previous marker is removed when a new city is searched
- Loading spinner while requests are in progress
- Friendly alert cards for errors (city not found, weather data not found, connection problems)
- Share button that copies a formatted weather message to the clipboard
- Responsive layout (mobile first)

## Technologies

- Semantic HTML5
- CSS3 (custom styling, Google Fonts, no frameworks)
- Vanilla JavaScript (ES6+, async/await, Fetch API)
- [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles

## APIs Used

| API | Purpose |
|---|---|
| Nominatim (OpenStreetMap) | Geocoding: converts a city name to latitude and longitude |
| OpenWeatherMap Current Weather API | Returns current weather data for the coordinates |
| OpenStreetMap Tile Server | Map tiles displayed by Leaflet |

## Project Structure

```
weathermap/
├── index.html
├── style.css
├── script.js
└── README.md
```


## How It Works

1. The form submit event is intercepted with `preventDefault()`, so the page never reloads.
2. The city name is sent to Nominatim to get its coordinates.
3. The coordinates are sent to OpenWeatherMap to get the weather.
4. The map flies to the location, the old marker is removed, and a new marker is added.
5. A popup card built with DOM methods shows the weather data.
6. Errors are caught with `try/catch` and displayed as alert cards. The spinner is hidden in a `finally` block.

## Extra Feature (Novelty)

**Share Weather:** the Share button in the popup copies a formatted weather message (city, temperature, humidity, wind speed, clouds and description) to the clipboard using the Clipboard API, and confirms it with a message card.

## Notes

- The API key is visible in client-side code because this is a front-end only project with a free key.
- The marker position depends on the first result returned by Nominatim, so it may be slightly off for cities with ambiguous names.

## Author

Raheeg Abd ALazim

Information Technology, Faculty of Computer Science and Information Technology,

Sudan University of Science and Technology.

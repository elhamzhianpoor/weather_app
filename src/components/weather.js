import React, { useState } from 'react';
import '../components/weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const [data, setData] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const API_KEY = 'f58165d153db4d490b8b1ba815fd7c04';

    // اصلاح شده: می‌تونه cityName بگیره یا از state استفاده کنه
    const fetchWeather = async (cityName = city) => {
        if (!cityName) return;
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
            );
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('خطا در دریافت اطلاعات:', error);
        }
    };

    const fetchSuggestions = async (input) => {
        if (input.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`;
            const response = await fetch(geoUrl);
            const results = await response.json();
            setSuggestions(results);
        } catch (error) {
            console.error('خطا در دریافت پیشنهادات:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
            setSuggestions([]);
        }
    };

    return (
        <div className={`weather-container ${darkMode ? 'dark' : ''}`}>
            <label className="switch">
                <input
                    type="checkbox"
                    onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
            </label>

            <h2>🌤️ Weather App</h2>

            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => {
                    setCity(e.target.value);
                    fetchSuggestions(e.target.value);
                }}
                onKeyDown={handleKeyDown}
            />

            <button onClick={() => {
                fetchWeather();
                setSuggestions([]);
            }}>Search</button>

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setCity(item.name);
                                setSuggestions([]);
                                fetchWeather(item.name);
                            }}
                        >
                            {item.name}, {item.country}
                        </li>
                    ))}
                </ul>
            )}

            {data && data.main && (
                <div className="weather-info">
                    <p>🏙️ City: {data.name}</p>
                    <p>🌡️ Temperature: {data.main.temp} °C</p>
                    <p>💨 Wind Speed: {data.wind.speed} m/s</p>
                    <p>🌫️ Description: {data.weather[0].description}</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                        alt="weather icon"
                    />
                </div>
            )}
        </div>
    );
};

export default Weather;
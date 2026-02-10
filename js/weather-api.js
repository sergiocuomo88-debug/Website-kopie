/**
 * Weather API module
 * Uses Open-Meteo (free, no API key required) for weather, UV, and air quality data.
 */

const WeatherAPI = {
    // Geocoding: city name -> coordinates
    async geocode(cityName) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=de&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Geocoding fehlgeschlagen');
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('Stadt nicht gefunden. Bitte überprüfe die Eingabe.');
        }
        const loc = data.results[0];
        return {
            lat: loc.latitude,
            lon: loc.longitude,
            name: loc.name,
            country: loc.country || '',
            admin: loc.admin1 || ''
        };
    },

    // Reverse geocoding: coordinates -> city name
    async reverseGeocode(lat, lon) {
        // Use a simple approach: find nearest city via Open-Meteo geocoding
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=de`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            return {
                lat,
                lon,
                name: data.city || data.locality || 'Aktueller Standort',
                country: data.countryName || '',
                admin: data.principalSubdivision || ''
            };
        } catch {
            return { lat, lon, name: 'Aktueller Standort', country: '', admin: '' };
        }
    },

    // Get current weather + UV index
    async getWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m,cloud_cover&daily=uv_index_max&timezone=auto&forecast_days=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Wetterdaten konnten nicht geladen werden');
        const data = await res.json();
        const c = data.current;
        return {
            temp: Math.round(c.temperature_2m),
            feelsLike: Math.round(c.apparent_temperature),
            humidity: c.relative_humidity_2m,
            windSpeed: Math.round(c.wind_speed_10m),
            windGusts: Math.round(c.wind_gusts_10m),
            precipitation: c.precipitation,
            rain: c.rain,
            weatherCode: c.weather_code,
            cloudCover: c.cloud_cover,
            uvIndex: data.daily?.uv_index_max?.[0] ?? null
        };
    },

    // Get UV index for location
    async getUV(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('UV-Daten konnten nicht geladen werden');
        const data = await res.json();
        return {
            dates: data.daily.time,
            uvMax: data.daily.uv_index_max,
            uvClearSky: data.daily.uv_index_clear_sky_max
        };
    },

    // Get air quality
    async getAirQuality(lat, lon) {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Luftqualitätsdaten konnten nicht geladen werden');
        const data = await res.json();
        const c = data.current;
        return {
            aqi: c.european_aqi,
            pm10: c.pm10,
            pm25: c.pm2_5,
            no2: c.nitrogen_dioxide,
            o3: c.ozone,
            so2: c.sulphur_dioxide
        };
    },

    // Weather code to icon and description
    getWeatherInfo(code) {
        const map = {
            0: { icon: '☀️', desc: 'Klar' },
            1: { icon: '🌤️', desc: 'Überwiegend klar' },
            2: { icon: '⛅', desc: 'Teilweise bewölkt' },
            3: { icon: '☁️', desc: 'Bewölkt' },
            45: { icon: '🌫️', desc: 'Nebel' },
            48: { icon: '🌫️', desc: 'Reifnebel' },
            51: { icon: '🌦️', desc: 'Leichter Nieselregen' },
            53: { icon: '🌦️', desc: 'Mäßiger Nieselregen' },
            55: { icon: '🌦️', desc: 'Starker Nieselregen' },
            61: { icon: '🌧️', desc: 'Leichter Regen' },
            63: { icon: '🌧️', desc: 'Mäßiger Regen' },
            65: { icon: '🌧️', desc: 'Starker Regen' },
            66: { icon: '🌧️', desc: 'Gefrierender Regen' },
            67: { icon: '🌧️', desc: 'Starker gefrierender Regen' },
            71: { icon: '🌨️', desc: 'Leichter Schneefall' },
            73: { icon: '🌨️', desc: 'Mäßiger Schneefall' },
            75: { icon: '❄️', desc: 'Starker Schneefall' },
            77: { icon: '🌨️', desc: 'Schneegriesel' },
            80: { icon: '🌦️', desc: 'Leichte Regenschauer' },
            81: { icon: '🌧️', desc: 'Mäßige Regenschauer' },
            82: { icon: '⛈️', desc: 'Starke Regenschauer' },
            85: { icon: '🌨️', desc: 'Leichte Schneeschauer' },
            86: { icon: '🌨️', desc: 'Starke Schneeschauer' },
            95: { icon: '⛈️', desc: 'Gewitter' },
            96: { icon: '⛈️', desc: 'Gewitter mit Hagel' },
            99: { icon: '⛈️', desc: 'Gewitter mit starkem Hagel' }
        };
        return map[code] || { icon: '🌡️', desc: 'Unbekannt' };
    },

    // UV index category
    getUVCategory(uvi) {
        if (uvi <= 2) return { level: 'Niedrig', color: '#4caf50', class: 'uv-low', advice: 'Kein besonderer Schutz nötig.' };
        if (uvi <= 5) return { level: 'Mäßig', color: '#ffeb3b', class: 'uv-moderate', advice: 'Sonnenschutz empfohlen: Hut, Sonnenbrille, Sonnencreme.' };
        if (uvi <= 7) return { level: 'Hoch', color: '#ff9800', class: 'uv-high', advice: 'Schutz erforderlich! Babys nicht der direkten Sonne aussetzen.' };
        if (uvi <= 10) return { level: 'Sehr hoch', color: '#f44336', class: 'uv-very-high', advice: 'Starker Schutz nötig! Babys unbedingt im Schatten halten.' };
        return { level: 'Extrem', color: '#9c27b0', class: 'uv-extreme', advice: 'Babys keinesfalls nach draußen bringen! Extreme UV-Strahlung.' };
    },

    // Air quality category (European AQI)
    getAQICategory(aqi) {
        if (aqi <= 20) return { level: 'Gut', color: '#4caf50', advice: 'Perfekt für einen Spaziergang mit dem Baby.' };
        if (aqi <= 40) return { level: 'Befriedigend', color: '#8bc34a', advice: 'Gute Bedingungen für draußen.' };
        if (aqi <= 60) return { level: 'Mäßig', color: '#ffeb3b', advice: 'Akzeptabel, aber empfindliche Babys sollten weniger Zeit draußen verbringen.' };
        if (aqi <= 80) return { level: 'Schlecht', color: '#ff9800', advice: 'Babys sollten nur kurz draußen sein. Meide stark befahrene Straßen.' };
        if (aqi <= 100) return { level: 'Sehr schlecht', color: '#f44336', advice: 'Babys besser drinnen lassen. Lüfte nur kurz stoßweise.' };
        return { level: 'Gefährlich', color: '#9c27b0', advice: 'Babys unbedingt drinnen halten! Gefährliche Luftqualität.' };
    }
};

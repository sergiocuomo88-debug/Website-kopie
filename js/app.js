/**
 * Main application logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // ============================
    // Cookie Banner
    // ============================
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner) {
        if (localStorage.getItem('cookies-accepted')) {
            cookieBanner.classList.add('hidden');
        }

        cookieAccept?.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            cookieBanner.classList.add('hidden');
        });

        cookieDecline?.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'false');
            cookieBanner.classList.add('hidden');
        });
    }

    // ============================
    // Mobile Menu
    // ============================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');

    menuBtn?.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // Close menu when clicking a link
    nav?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('open'));
    });

    // ============================
    // Toggle Button Groups
    // ============================
    document.querySelectorAll('.btn-group').forEach(group => {
        group.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // ============================
    // Tab Navigation
    // ============================
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabGroup = btn.closest('.content-card') || btn.closest('.calculator-card') || document;
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    // ============================
    // Clothing Calculator (index.html)
    // ============================
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const locationInput = document.getElementById('location-input');
    const locationStatus = document.getElementById('location-status');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    function getSelectedValue(groupId) {
        const group = document.getElementById(groupId);
        if (!group) return null;
        const active = group.querySelector('.btn-toggle.active');
        return active ? active.dataset.value : null;
    }

    async function calculateClothing(lat, lon, locationName) {
        if (!loading || !results) return;

        loading.classList.remove('hidden');
        results.classList.add('hidden');

        try {
            const weather = await WeatherAPI.getWeather(lat, lon);
            const weatherInfo = WeatherAPI.getWeatherInfo(weather.weatherCode);
            const age = getSelectedValue('age-group') || '0-3';
            const situation = getSelectedValue('situation-group') || 'kinderwagen';

            // Display weather info
            document.getElementById('weather-icon').textContent = weatherInfo.icon;
            document.getElementById('weather-temp').textContent = `${weather.temp}°C`;
            document.getElementById('weather-feels').textContent = `Gefühlt: ${weather.feelsLike}°C – ${weatherInfo.desc}`;
            document.getElementById('weather-wind').textContent = `${weather.windSpeed} km/h`;
            document.getElementById('weather-humidity').textContent = `${weather.humidity}%`;
            document.getElementById('weather-uvi').textContent = weather.uvIndex != null ? weather.uvIndex.toFixed(1) : '--';
            document.getElementById('weather-location').textContent = locationName;

            // Get clothing recommendation
            const recommendation = ClothingLogic.getRecommendation(
                weather.temp, weather.feelsLike, weather, age, situation
            );

            // Render clothesline
            const clothesline = document.getElementById('clothesline');
            clothesline.innerHTML = recommendation.items.map(item => `
                <div class="clothing-item">
                    <span class="item-icon">${item.icon}</span>
                    <span class="item-name">${item.name}</span>
                </div>
            `).join('');

            // Render clothing list
            const clothingList = document.getElementById('clothing-list');
            clothingList.innerHTML = recommendation.items.map(item => `
                <div class="clothing-list-item">
                    <span class="item-icon">${item.icon}</span>
                    <span>${item.name}</span>
                </div>
            `).join('');

            // Render tips
            const tipsList = document.getElementById('tips-list');
            tipsList.innerHTML = recommendation.tips.map(tip => `<li>${tip}</li>`).join('');

            // UV Warning
            const uvWarning = document.getElementById('uv-warning');
            const uvWarningText = document.getElementById('uv-warning-text');
            if (weather.uvIndex > 3) {
                const uvCat = WeatherAPI.getUVCategory(weather.uvIndex);
                uvWarning.classList.remove('hidden');
                uvWarningText.textContent = `UV-Index: ${weather.uvIndex.toFixed(1)} (${uvCat.level}) – ${uvCat.advice}`;
            } else {
                uvWarning.classList.add('hidden');
            }

            loading.classList.add('hidden');
            results.classList.remove('hidden');
        } catch (err) {
            loading.classList.add('hidden');
            setStatus(err.message, 'error');
        }
    }

    function setStatus(msg, type = '') {
        if (!locationStatus) return;
        locationStatus.textContent = msg;
        locationStatus.className = 'location-status' + (type ? ` ${type}` : '');
    }

    // Search by city name
    searchBtn?.addEventListener('click', async () => {
        const city = locationInput.value.trim();
        if (!city) {
            setStatus('Bitte gib eine Stadt ein.', 'error');
            return;
        }
        setStatus('Suche...', '');
        try {
            const loc = await WeatherAPI.geocode(city);
            setStatus(`${loc.name}${loc.admin ? ', ' + loc.admin : ''}, ${loc.country}`, 'success');
            await calculateClothing(loc.lat, loc.lon, `${loc.name}, ${loc.country}`);
        } catch (err) {
            setStatus(err.message, 'error');
        }
    });

    // Enter key triggers search
    locationInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn?.click();
    });

    // Geolocation
    locationBtn?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation wird von deinem Browser nicht unterstützt.', 'error');
            return;
        }
        setStatus('Standort wird ermittelt...', '');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const loc = await WeatherAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                    locationInput.value = loc.name;
                    setStatus(`Standort: ${loc.name}${loc.admin ? ', ' + loc.admin : ''}`, 'success');
                    await calculateClothing(loc.lat, loc.lon, loc.name);
                } catch (err) {
                    setStatus('Standort gefunden, lade Wetter...', '');
                    await calculateClothing(pos.coords.latitude, pos.coords.longitude, 'Aktueller Standort');
                }
            },
            (err) => {
                setStatus('Standortzugriff verweigert. Bitte gib eine Stadt manuell ein.', 'error');
            }
        );
    });

    // Re-calculate when age/situation changes (if results already shown)
    document.querySelectorAll('#age-group .btn-toggle, #situation-group .btn-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            if (results && !results.classList.contains('hidden')) {
                // Re-trigger calculation with current location
                searchBtn?.click();
            }
        });
    });

    // ============================
    // UV Calculator (uv-rechner.html)
    // ============================
    const uvSearchBtn = document.getElementById('uv-search-btn');
    const uvLocationBtn = document.getElementById('uv-location-btn');
    const uvLocationInput = document.getElementById('uv-location-input');
    const uvStatus = document.getElementById('uv-status');
    const uvLoading = document.getElementById('uv-loading');
    const uvResults = document.getElementById('uv-results');

    function setUVStatus(msg, type = '') {
        if (!uvStatus) return;
        uvStatus.textContent = msg;
        uvStatus.className = 'location-status' + (type ? ` ${type}` : '');
    }

    async function loadUVData(lat, lon, name) {
        if (!uvLoading || !uvResults) return;
        uvLoading.classList.remove('hidden');
        uvResults.classList.add('hidden');

        try {
            const data = await WeatherAPI.getUV(lat, lon);
            const todayUV = data.uvMax[0];
            const cat = WeatherAPI.getUVCategory(todayUV);

            document.getElementById('uv-location-name').textContent = name;
            const uvValueEl = document.getElementById('uv-value');
            uvValueEl.textContent = todayUV.toFixed(1);
            uvValueEl.style.color = cat.color;
            document.getElementById('uv-category').textContent = cat.level;
            document.getElementById('uv-category').style.color = cat.color;
            document.getElementById('uv-advice').textContent = cat.advice;

            // Highlight active level on scale
            document.querySelectorAll('.uv-level').forEach(el => el.classList.remove('active'));
            let activeClass = cat.class;
            const activeEl = document.querySelector(`.uv-level.${activeClass}`);
            if (activeEl) activeEl.classList.add('active');

            // 7-day forecast
            const forecastEl = document.getElementById('uv-forecast');
            if (forecastEl) {
                forecastEl.innerHTML = data.dates.map((date, i) => {
                    const d = new Date(date);
                    const dayName = d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
                    const uv = data.uvMax[i];
                    const c = WeatherAPI.getUVCategory(uv);
                    return `
                        <div class="uv-forecast-day">
                            <span class="uv-forecast-date">${dayName}</span>
                            <span class="uv-forecast-value" style="background:${c.color};color:${uv > 4 ? 'white' : '#333'}">${uv.toFixed(1)}</span>
                            <span class="uv-forecast-level">${c.level}</span>
                        </div>
                    `;
                }).join('');
            }

            uvLoading.classList.add('hidden');
            uvResults.classList.remove('hidden');
        } catch (err) {
            uvLoading.classList.add('hidden');
            setUVStatus(err.message, 'error');
        }
    }

    uvSearchBtn?.addEventListener('click', async () => {
        const city = uvLocationInput.value.trim();
        if (!city) { setUVStatus('Bitte gib eine Stadt ein.', 'error'); return; }
        setUVStatus('Suche...', '');
        try {
            const loc = await WeatherAPI.geocode(city);
            setUVStatus(`${loc.name}, ${loc.country}`, 'success');
            await loadUVData(loc.lat, loc.lon, `${loc.name}, ${loc.country}`);
        } catch (err) { setUVStatus(err.message, 'error'); }
    });

    uvLocationInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') uvSearchBtn?.click(); });

    uvLocationBtn?.addEventListener('click', () => {
        if (!navigator.geolocation) { setUVStatus('Geolocation nicht unterstützt.', 'error'); return; }
        setUVStatus('Standort wird ermittelt...', '');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const loc = await WeatherAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                uvLocationInput.value = loc.name;
                setUVStatus(`Standort: ${loc.name}`, 'success');
                await loadUVData(loc.lat, loc.lon, loc.name);
            },
            () => setUVStatus('Standortzugriff verweigert.', 'error')
        );
    });

    // ============================
    // Air Quality (luftqualitaet.html)
    // ============================
    const aqSearchBtn = document.getElementById('aq-search-btn');
    const aqLocationBtn = document.getElementById('aq-location-btn');
    const aqLocationInput = document.getElementById('aq-location-input');
    const aqStatus = document.getElementById('aq-status');
    const aqLoading = document.getElementById('aq-loading');
    const aqResults = document.getElementById('aq-results');

    function setAQStatus(msg, type = '') {
        if (!aqStatus) return;
        aqStatus.textContent = msg;
        aqStatus.className = 'location-status' + (type ? ` ${type}` : '');
    }

    async function loadAQData(lat, lon, name) {
        if (!aqLoading || !aqResults) return;
        aqLoading.classList.remove('hidden');
        aqResults.classList.add('hidden');

        try {
            const data = await WeatherAPI.getAirQuality(lat, lon);
            const cat = WeatherAPI.getAQICategory(data.aqi);

            document.getElementById('aq-location-name').textContent = name;
            const aqValueEl = document.getElementById('aq-value');
            aqValueEl.textContent = data.aqi;
            aqValueEl.style.color = cat.color;
            document.getElementById('aq-category').textContent = cat.level;
            document.getElementById('aq-category').style.color = cat.color;
            document.getElementById('aq-advice').textContent = cat.advice;

            // Move AQI pointer
            const pointer = document.getElementById('aqi-pointer');
            if (pointer) {
                const pct = Math.min((data.aqi / 150) * 100, 100);
                pointer.style.left = `${pct}%`;
            }

            // Pollutant details
            document.getElementById('aq-pm25').textContent = data.pm25?.toFixed(1) ?? '--';
            document.getElementById('aq-pm10').textContent = data.pm10?.toFixed(1) ?? '--';
            document.getElementById('aq-no2').textContent = data.no2?.toFixed(1) ?? '--';
            document.getElementById('aq-o3').textContent = data.o3?.toFixed(1) ?? '--';

            aqLoading.classList.add('hidden');
            aqResults.classList.remove('hidden');
        } catch (err) {
            aqLoading.classList.add('hidden');
            setAQStatus(err.message, 'error');
        }
    }

    aqSearchBtn?.addEventListener('click', async () => {
        const city = aqLocationInput.value.trim();
        if (!city) { setAQStatus('Bitte gib eine Stadt ein.', 'error'); return; }
        setAQStatus('Suche...', '');
        try {
            const loc = await WeatherAPI.geocode(city);
            setAQStatus(`${loc.name}, ${loc.country}`, 'success');
            await loadAQData(loc.lat, loc.lon, `${loc.name}, ${loc.country}`);
        } catch (err) { setAQStatus(err.message, 'error'); }
    });

    aqLocationInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') aqSearchBtn?.click(); });

    aqLocationBtn?.addEventListener('click', () => {
        if (!navigator.geolocation) { setAQStatus('Geolocation nicht unterstützt.', 'error'); return; }
        setAQStatus('Standort wird ermittelt...', '');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const loc = await WeatherAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                aqLocationInput.value = loc.name;
                setAQStatus(`Standort: ${loc.name}`, 'success');
                await loadAQData(loc.lat, loc.lon, loc.name);
            },
            () => setAQStatus('Standortzugriff verweigert.', 'error')
        );
    });

    // ============================
    // Age Calculator (altersrechner.html)
    // ============================
    const ageCalcBtn = document.getElementById('age-calc-btn');
    const ageDateInput = document.getElementById('age-date-input');
    const ageResultDiv = document.getElementById('age-result');

    ageCalcBtn?.addEventListener('click', () => {
        const dateVal = ageDateInput?.value;
        if (!dateVal) return;

        const birthDate = new Date(dateVal);
        const now = new Date();

        if (birthDate > now) {
            // Due date: show countdown
            const diffMs = birthDate - now;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);
            const remainDays = diffDays % 7;

            ageResultDiv.innerHTML = `
                <div class="age-result">
                    <div class="age-main">Noch ${diffWeeks} Wochen und ${remainDays} Tage</div>
                    <div class="age-detail">Errechneter Geburtstermin: ${birthDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
            `;
            return;
        }

        const diffMs = now - birthDate;
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = monthDiff(birthDate, now);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        const remainingDays = totalDays - Math.floor(totalMonths * 30.44);

        let ageText = '';
        if (years > 0) {
            ageText = `${years} ${years === 1 ? 'Jahr' : 'Jahre'} und ${months} ${months === 1 ? 'Monat' : 'Monate'}`;
        } else if (totalMonths > 0) {
            ageText = `${totalMonths} ${totalMonths === 1 ? 'Monat' : 'Monate'}`;
        } else if (totalWeeks > 0) {
            ageText = `${totalWeeks} ${totalWeeks === 1 ? 'Woche' : 'Wochen'} und ${totalDays % 7} Tage`;
        } else {
            ageText = `${totalDays} ${totalDays === 1 ? 'Tag' : 'Tage'}`;
        }

        let detailText = `${totalDays} Tage | ${totalWeeks} Wochen | ${totalMonths} Monate`;

        // Milestones
        const milestones = getMilestones(totalMonths, totalDays);

        ageResultDiv.innerHTML = `
            <div class="age-result">
                <div class="age-main">${ageText} alt</div>
                <div class="age-detail">${detailText}</div>
            </div>
            ${milestones.length > 0 ? `
                <div class="age-milestones">
                    <h3>Meilensteine in diesem Alter</h3>
                    ${milestones.map(m => `
                        <div class="milestone">
                            <span class="milestone-icon">${m.icon}</span>
                            <div>
                                <h4>${m.title}</h4>
                                <p>${m.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    });

    function monthDiff(d1, d2) {
        let months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        if (d2.getDate() < d1.getDate()) months--;
        return Math.max(0, months);
    }

    function getMilestones(months, days) {
        const all = [
            { min: 0, max: 1, icon: '👀', title: 'Neugeborenes', desc: 'Dein Baby kann Gesichter in ca. 20-30 cm Entfernung erkennen und reagiert auf Stimmen.' },
            { min: 1, max: 3, icon: '😊', title: 'Soziales Lächeln', desc: 'Dein Baby beginnt bewusst zu lächeln und Blickkontakt zu halten.' },
            { min: 3, max: 5, icon: '🤲', title: 'Greifen', desc: 'Dein Baby beginnt gezielt nach Gegenständen zu greifen.' },
            { min: 4, max: 6, icon: '🔄', title: 'Drehen', desc: 'Viele Babys lernen sich jetzt vom Bauch auf den Rücken zu drehen.' },
            { min: 5, max: 8, icon: '🥄', title: 'Beikost', desc: 'Dein Baby zeigt möglicherweise Interesse an fester Nahrung (Beikostreife).' },
            { min: 6, max: 10, icon: '🪥', title: 'Erste Zähne', desc: 'Die ersten Zähnchen können durchbrechen. Beißringe können helfen.' },
            { min: 7, max: 10, icon: '🧸', title: 'Sitzen', desc: 'Dein Baby lernt selbstständig zu sitzen.' },
            { min: 8, max: 12, icon: '🐛', title: 'Krabbeln', desc: 'Viele Babys beginnen zu krabbeln oder sich fortzubewegen.' },
            { min: 9, max: 14, icon: '🧍', title: 'Hochziehen', desc: 'Dein Baby zieht sich an Möbeln hoch und steht.' },
            { min: 10, max: 16, icon: '🚶', title: 'Erste Schritte', desc: 'Die ersten freien Schritte können jetzt kommen!' },
            { min: 12, max: 18, icon: '🗣️', title: 'Erste Worte', desc: 'Mama, Papa – die ersten bewussten Worte werden gesprochen.' },
        ];
        return all.filter(m => months >= m.min && months <= m.max);
    }

    // ============================
    // Temperature Tables (temperatur-tabellen.html)
    // ============================
    function renderTempTable(situation) {
        const tableBody = document.getElementById('temp-table-body');
        if (!tableBody) return;

        const data = ClothingLogic.getTemperatureTable(situation);
        tableBody.innerHTML = data.map(row => {
            let tempClass = 'temp-mild';
            if (row.range.includes('Unter') || row.range.includes('-10')) tempClass = 'temp-cold';
            else if (row.range.includes('0 bis') || row.range.includes('5 bis')) tempClass = 'temp-cool';
            else if (row.range.includes('25') || row.range.includes('30')) tempClass = 'temp-warm';
            else if (row.range.includes('Über')) tempClass = 'temp-hot';

            return `
                <tr>
                    <td><span class="temp-range ${tempClass}">${row.range}</span></td>
                    <td>${row.clothes}</td>
                    <td>${row.note || '–'}</td>
                </tr>
            `;
        }).join('');
    }

    // Initial render for temperature table page
    const tempTableBody = document.getElementById('temp-table-body');
    if (tempTableBody) {
        renderTempTable('kinderwagen');
    }

    // Tab buttons for temperature table
    document.querySelectorAll('[data-table-situation]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-table-situation]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTempTable(btn.dataset.tableSituation);
        });
    });
});

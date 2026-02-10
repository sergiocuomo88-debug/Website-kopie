/**
 * Clothing recommendation logic
 * Returns clothing items based on temperature, weather, baby age, and situation.
 */

const ClothingLogic = {
    // Clothing item definitions with icons
    items: {
        // Head
        wintermuetze:   { name: 'Wintermütze', icon: '🧶', category: 'Kopf' },
        muetze:         { name: 'Mütze', icon: '🧢', category: 'Kopf' },
        sonnenhut:      { name: 'Sonnenhut', icon: '👒', category: 'Kopf' },

        // Upper body
        unterhemd:      { name: 'Unterhemd', icon: '👕', category: 'Oberkörper' },
        langarm_body:   { name: 'Langarm-Body', icon: '👕', category: 'Oberkörper' },
        kurzarm_body:   { name: 'Kurzarm-Body', icon: '👶', category: 'Oberkörper' },
        pullover:       { name: 'Pullover', icon: '🧥', category: 'Oberkörper' },
        strickjacke:    { name: 'Strickjacke', icon: '🧥', category: 'Oberkörper' },
        fleece_jacke:   { name: 'Fleece-Jacke', icon: '🧥', category: 'Oberkörper' },
        winterjacke:    { name: 'Winterjacke', icon: '🧥', category: 'Oberkörper' },
        tshirt:         { name: 'T-Shirt', icon: '👕', category: 'Oberkörper' },

        // Lower body
        strumpfhose:    { name: 'Strumpfhose', icon: '🧦', category: 'Unterkörper' },
        leggings:       { name: 'Leggings', icon: '👖', category: 'Unterkörper' },
        hose:           { name: 'Hose', icon: '👖', category: 'Unterkörper' },
        strampler:      { name: 'Strampler', icon: '👶', category: 'Ganzkörper' },
        overall:        { name: 'Overall', icon: '🧥', category: 'Ganzkörper' },
        schneeanzug:    { name: 'Schneeanzug', icon: '🧥', category: 'Ganzkörper' },
        schlafsack:     { name: 'Schlafsack', icon: '🛏️', category: 'Schlafen' },
        duenner_schlafsack: { name: 'Dünner Schlafsack', icon: '🛏️', category: 'Schlafen' },
        wollwalk:       { name: 'Wollwalk-Anzug', icon: '🧥', category: 'Ganzkörper' },

        // Feet
        socken:         { name: 'Socken', icon: '🧦', category: 'Füße' },
        dicke_socken:   { name: 'Dicke Socken', icon: '🧦', category: 'Füße' },
        schuhe:         { name: 'Schuhe', icon: '👟', category: 'Füße' },
        winterschuhe:   { name: 'Winterschuhe', icon: '🥾', category: 'Füße' },

        // Hands
        handschuhe:     { name: 'Handschuhe', icon: '🧤', category: 'Hände' },
        faeustlinge:    { name: 'Fäustlinge', icon: '🧤', category: 'Hände' },

        // Accessories
        halstuch:       { name: 'Halstuch', icon: '🧣', category: 'Zubehör' },
        schal:          { name: 'Schal', icon: '🧣', category: 'Zubehör' },
        fusssack:       { name: 'Fußsack', icon: '🛏️', category: 'Zubehör' },
        decke:          { name: 'Leichte Decke', icon: '🛏️', category: 'Zubehör' },
        regenverdeck:   { name: 'Regenverdeck', icon: '☔', category: 'Zubehör' },
        sonnensegel:    { name: 'Sonnensegel', icon: '⛱️', category: 'Zubehör' },
        sonnencreme:    { name: 'Sonnencreme LSF50+', icon: '🧴', category: 'Zubehör' },
    },

    /**
     * Get clothing recommendation
     * @param {number} temp - Temperature in °C
     * @param {number} feelsLike - Feels-like temperature
     * @param {object} weather - Weather data (windSpeed, rain, weatherCode, uvIndex)
     * @param {string} age - "0-3" or "4+"
     * @param {string} situation - kinderwagen, trage, auto, schlafen, zuhause, allgemein
     * @returns {object} { items: [...], tips: [...] }
     */
    getRecommendation(temp, feelsLike, weather, age, situation) {
        const effectiveTemp = feelsLike ?? temp;
        const isRaining = weather.rain > 0 || [51,53,55,61,63,65,66,67,80,81,82].includes(weather.weatherCode);
        const isSnowing = [71,73,75,77,85,86].includes(weather.weatherCode);
        const isWindy = weather.windSpeed > 20;
        const isYoungBaby = age === '0-3';
        const uvHigh = weather.uvIndex > 3;

        let clothes = [];
        let tips = [];

        // Temperature-based recommendations
        if (situation === 'schlafen') {
            return this._getSleepRecommendation(temp, isYoungBaby);
        }

        if (situation === 'zuhause') {
            return this._getIndoorRecommendation(temp, isYoungBaby);
        }

        if (situation === 'auto') {
            return this._getCarRecommendation(effectiveTemp, isYoungBaby);
        }

        // Outdoor situations: kinderwagen, trage, allgemein
        const isTrage = situation === 'trage';
        const isKinderwagen = situation === 'kinderwagen';

        if (effectiveTemp < -10) {
            // Extreme cold
            clothes = ['langarm_body', 'unterhemd', 'pullover', 'strumpfhose'];
            if (isKinderwagen) {
                clothes.push('schneeanzug', 'wintermuetze', 'dicke_socken', 'winterschuhe', 'faeustlinge', 'schal', 'fusssack');
            } else if (isTrage) {
                clothes.push('fleece_jacke', 'wintermuetze', 'dicke_socken', 'faeustlinge', 'schal');
            } else {
                clothes.push('schneeanzug', 'wintermuetze', 'dicke_socken', 'winterschuhe', 'faeustlinge', 'schal');
            }
            tips.push('Bei extremer Kälte: Spaziergänge kurzhalten (max. 20-30 Min.).');
            if (isYoungBaby) tips.push('Neugeborene frieren schneller – eine extra Schicht anziehen.');

        } else if (effectiveTemp < 0) {
            // Freezing
            clothes = ['langarm_body', 'pullover', 'strumpfhose'];
            if (isKinderwagen) {
                clothes.push('wollwalk', 'wintermuetze', 'dicke_socken', 'winterschuhe', 'faeustlinge', 'fusssack');
            } else if (isTrage) {
                clothes.push('fleece_jacke', 'wintermuetze', 'dicke_socken', 'faeustlinge');
            } else {
                clothes.push('wollwalk', 'wintermuetze', 'dicke_socken', 'winterschuhe', 'faeustlinge');
            }
            if (isSnowing) clothes.push('regenverdeck');
            tips.push('Regelmäßig den Nackentest machen.');

        } else if (effectiveTemp < 5) {
            // Cold
            clothes = ['langarm_body', 'pullover', 'strumpfhose', 'hose'];
            if (isKinderwagen) {
                clothes.push('winterjacke', 'wintermuetze', 'dicke_socken', 'faeustlinge', 'fusssack');
            } else if (isTrage) {
                clothes.push('fleece_jacke', 'muetze', 'socken');
            } else {
                clothes.push('winterjacke', 'wintermuetze', 'dicke_socken', 'faeustlinge');
            }
            if (isRaining) clothes.push('regenverdeck');

        } else if (effectiveTemp < 10) {
            // Cool
            clothes = ['langarm_body', 'pullover', 'strumpfhose', 'hose'];
            if (isKinderwagen) {
                clothes.push('strickjacke', 'muetze', 'socken', 'fusssack');
            } else if (isTrage) {
                clothes.push('strickjacke', 'muetze', 'socken');
            } else {
                clothes.push('strickjacke', 'muetze', 'socken', 'schuhe');
            }
            if (isRaining) clothes.push('regenverdeck');
            if (isWindy) {
                clothes.push('halstuch');
                tips.push('Es ist windig – Halstuch schützt vor Zugluft.');
            }

        } else if (effectiveTemp < 15) {
            // Mild-cool
            clothes = ['langarm_body', 'hose'];
            if (isKinderwagen) {
                clothes.push('strickjacke', 'muetze', 'socken', 'decke');
            } else if (isTrage) {
                clothes.push('strickjacke', 'socken');
            } else {
                clothes.push('strickjacke', 'muetze', 'socken', 'schuhe');
            }
            if (isRaining) clothes.push('regenverdeck');

        } else if (effectiveTemp < 20) {
            // Mild
            clothes = ['langarm_body', 'hose', 'socken'];
            if (isKinderwagen) {
                clothes.push('strickjacke', 'decke');
            } else if (isTrage) {
                clothes.push('strickjacke');
            } else {
                clothes.push('strickjacke', 'schuhe');
            }
            if (isWindy) tips.push('Bei Wind eine dünne Jacke mitnehmen.');

        } else if (effectiveTemp < 25) {
            // Warm
            clothes = ['kurzarm_body', 'leggings', 'socken'];
            if (isKinderwagen) {
                clothes.push('sonnenhut');
                if (isYoungBaby) clothes.push('decke');
            } else if (isTrage) {
                clothes.push('sonnenhut');
            } else {
                clothes.push('sonnenhut', 'schuhe');
            }
            if (uvHigh) {
                clothes.push('sonnencreme', 'sonnensegel');
                tips.push('UV-Index ist hoch – Sonnenschutz auftragen und Schatten suchen.');
            }

        } else if (effectiveTemp < 30) {
            // Hot
            clothes = ['kurzarm_body', 'sonnenhut'];
            if (!isTrage) clothes.push('leggings');
            if (uvHigh) {
                clothes.push('sonnencreme', 'sonnensegel');
                tips.push('Starke Sonne! Baby im Schatten halten und Sonnencreme verwenden.');
            }
            tips.push('Regelmäßig Flüssigkeit anbieten.');
            tips.push('Mittagshitze (11–15 Uhr) meiden.');

        } else {
            // Very hot (30+)
            clothes = ['kurzarm_body', 'sonnenhut'];
            if (uvHigh) {
                clothes.push('sonnencreme', 'sonnensegel');
            }
            tips.push('Extreme Hitze! Am besten drinnen bleiben oder nur im Schatten.');
            tips.push('Viel trinken lassen. Auf Überhitzungszeichen achten.');
            tips.push('Kein Ventilator direkt auf das Baby richten.');
        }

        // Extra layer for young babies in outdoor situations
        if (isYoungBaby && effectiveTemp < 20 && !clothes.includes('unterhemd')) {
            clothes.splice(1, 0, 'unterhemd');
            tips.push('Babys unter 3 Monaten brauchen eine extra Schicht.');
        }

        // Rain tip
        if (isRaining) {
            tips.push('Es regnet – Regenverdeck nicht vergessen!');
        }

        // General tips
        tips.push('Mache regelmäßig den Nackentest: Warm & trocken = perfekt.');

        // Remove duplicates
        clothes = [...new Set(clothes)];
        tips = [...new Set(tips)];

        return {
            items: clothes.map(key => ({ key, ...this.items[key] })),
            tips
        };
    },

    _getSleepRecommendation(temp, isYoungBaby) {
        let clothes = [];
        let tips = ['Ideale Schlaftemperatur: 16–18°C.', 'Keine Decken, Kissen oder Kuscheltiere im Bett.'];

        if (temp < 16) {
            clothes = ['langarm_body', 'strampler', 'schlafsack', 'socken'];
            if (isYoungBaby) tips.push('Neugeborene: Ggf. ein dünnes Mützchen aufsetzen.');
        } else if (temp < 20) {
            clothes = ['langarm_body', 'strampler', 'schlafsack'];
            tips.push('Perfekte Schlaftemperatur!');
        } else if (temp < 24) {
            clothes = ['kurzarm_body', 'duenner_schlafsack'];
            tips.push('Leichten Schlafsack verwenden (0.5–1.0 TOG).');
        } else {
            clothes = ['kurzarm_body'];
            tips.push('Bei großer Hitze reicht ein Body oder sogar nur eine Windel.');
            tips.push('Lüfte das Zimmer vor dem Schlafengehen gut durch.');
        }

        return {
            items: clothes.map(key => ({ key, ...this.items[key] })),
            tips
        };
    },

    _getIndoorRecommendation(temp, isYoungBaby) {
        let clothes = [];
        let tips = ['Ideale Raumtemperatur: 20–22°C.'];

        if (temp < 18) {
            clothes = ['langarm_body', 'strampler', 'socken'];
            if (isYoungBaby) clothes.push('muetze');
            tips.push('Es ist etwas kühl – ggf. die Heizung aufdrehen.');
        } else if (temp < 22) {
            clothes = ['langarm_body', 'strampler', 'socken'];
        } else if (temp < 26) {
            clothes = ['kurzarm_body', 'leggings'];
            tips.push('Leichte Kleidung reicht bei diesen Temperaturen.');
        } else {
            clothes = ['kurzarm_body'];
            tips.push('Sehr warm – ein Body reicht. Ausreichend Flüssigkeit anbieten.');
        }

        return {
            items: clothes.map(key => ({ key, ...this.items[key] })),
            tips
        };
    },

    _getCarRecommendation(temp, isYoungBaby) {
        let clothes = [];
        let tips = [
            'Im Auto keine dicke Jacke anziehen – die Gurte sitzen sonst nicht sicher!',
            'Dicke Jacke ausziehen und stattdessen eine Decke über den Gurt legen.'
        ];

        if (temp < 5) {
            clothes = ['langarm_body', 'pullover', 'strumpfhose', 'hose', 'socken', 'muetze', 'decke'];
        } else if (temp < 15) {
            clothes = ['langarm_body', 'strickjacke', 'hose', 'socken'];
        } else if (temp < 22) {
            clothes = ['langarm_body', 'hose', 'socken'];
        } else {
            clothes = ['kurzarm_body', 'leggings'];
            tips.push('Auto vor Fahrtantritt gut durchlüften – Kindersitze heizen sich auf!');
        }

        if (isYoungBaby) {
            tips.push('Neugeborene sollten nicht länger als 30 Minuten in der Babyschale sitzen.');
        }

        return {
            items: clothes.map(key => ({ key, ...this.items[key] })),
            tips
        };
    },

    // Temperature table data for the table page
    getTemperatureTable(situation) {
        const tables = {
            kinderwagen: [
                { range: 'Unter -10°C', clothes: 'Langarm-Body, Unterhemd, Pullover, Strumpfhose, Schneeanzug, Wintermütze, Dicke Socken, Winterschuhe, Fäustlinge, Schal, Fußsack', note: 'Spaziergänge kurzhalten!' },
                { range: '-10 bis 0°C', clothes: 'Langarm-Body, Pullover, Strumpfhose, Wollwalk-Anzug, Wintermütze, Dicke Socken, Winterschuhe, Fäustlinge, Fußsack', note: 'Lammfell-Fußsack empfohlen' },
                { range: '0 bis 5°C', clothes: 'Langarm-Body, Pullover, Strumpfhose, Hose, Winterjacke, Wintermütze, Dicke Socken, Fäustlinge, Fußsack', note: '' },
                { range: '5 bis 10°C', clothes: 'Langarm-Body, Pullover, Strumpfhose, Hose, Strickjacke, Mütze, Socken, Fußsack', note: '' },
                { range: '10 bis 15°C', clothes: 'Langarm-Body, Hose, Strickjacke, Mütze, Socken, Leichte Decke', note: '' },
                { range: '15 bis 20°C', clothes: 'Langarm-Body, Hose, Socken, Strickjacke, Leichte Decke', note: 'Decke für den Fall' },
                { range: '20 bis 25°C', clothes: 'Kurzarm-Body, Leggings, Socken, Sonnenhut', note: 'Sonnenschutz nicht vergessen' },
                { range: '25 bis 30°C', clothes: 'Kurzarm-Body, Leggings, Sonnenhut, Sonnencreme', note: 'Mittagshitze meiden' },
                { range: 'Über 30°C', clothes: 'Kurzarm-Body, Sonnenhut, Sonnencreme, Sonnensegel', note: 'Am besten drinnen bleiben' },
            ],
            trage: [
                { range: 'Unter -10°C', clothes: 'Langarm-Body, Unterhemd, Pullover, Strumpfhose, Fleece-Jacke, Wintermütze, Dicke Socken, Fäustlinge, Schal', note: 'Körperwärme wärmt mit' },
                { range: '-10 bis 0°C', clothes: 'Langarm-Body, Pullover, Strumpfhose, Fleece-Jacke, Wintermütze, Dicke Socken, Fäustlinge', note: '' },
                { range: '0 bis 5°C', clothes: 'Langarm-Body, Pullover, Strumpfhose, Hose, Fleece-Jacke, Muetze, Socken', note: '' },
                { range: '5 bis 10°C', clothes: 'Langarm-Body, Pullover, Strumpfhose, Hose, Strickjacke, Mütze, Socken', note: '' },
                { range: '10 bis 15°C', clothes: 'Langarm-Body, Hose, Strickjacke, Socken', note: 'In der Trage eine Schicht weniger' },
                { range: '15 bis 20°C', clothes: 'Langarm-Body, Hose, Strickjacke', note: '' },
                { range: '20 bis 25°C', clothes: 'Kurzarm-Body, Leggings, Socken, Sonnenhut', note: '' },
                { range: '25 bis 30°C', clothes: 'Kurzarm-Body, Sonnenhut', note: 'Auf Überhitzung achten' },
                { range: 'Über 30°C', clothes: 'Kurzarm-Body, Sonnenhut, Sonnencreme', note: 'Trage kann sehr warm werden' },
            ],
            schlafen: [
                { range: 'Unter 16°C', clothes: 'Langarm-Body, Strampler, Schlafsack (2.5 TOG), Socken', note: 'Zimmer ggf. leicht heizen' },
                { range: '16 bis 18°C', clothes: 'Langarm-Body, Strampler, Schlafsack (2.5 TOG)', note: 'Ideale Schlaftemperatur!' },
                { range: '18 bis 20°C', clothes: 'Langarm-Body, Strampler, Schlafsack (1.0 TOG)', note: '' },
                { range: '20 bis 22°C', clothes: 'Langarm-Body, Schlafsack (1.0 TOG)', note: '' },
                { range: '22 bis 24°C', clothes: 'Kurzarm-Body, Dünner Schlafsack (0.5 TOG)', note: '' },
                { range: '24 bis 26°C', clothes: 'Kurzarm-Body, Dünner Schlafsack (0.5 TOG)', note: 'Gut lüften vor dem Schlafen' },
                { range: 'Über 26°C', clothes: 'Kurzarm-Body oder nur Windel', note: 'Kein Schlafsack nötig' },
            ]
        };
        return tables[situation] || tables.kinderwagen;
    }
};

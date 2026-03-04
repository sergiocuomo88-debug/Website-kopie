/* ============================
   eltern-fakten – Fuzzy Search
   ============================ */

const Search = {
    /**
     * Fuzzy-match: Prüft ob alle Zeichen des Suchbegriffs
     * in der richtigen Reihenfolge im Text vorkommen
     */
    fuzzyMatch(query, text) {
        const q = query.toLowerCase();
        const t = text.toLowerCase();

        // Exakter Substring-Match → höchster Score
        if (t.includes(q)) return 100;

        // Wort-Match: Alle Suchwörter müssen vorkommen
        const words = q.split(/\s+/).filter(w => w.length > 1);
        if (words.length > 1) {
            const allFound = words.every(w => t.includes(w));
            if (allFound) return 80;
        }

        // Einzelne Wörter teilweise gefunden
        if (words.length > 1) {
            const foundCount = words.filter(w => t.includes(w)).length;
            if (foundCount > 0) return (foundCount / words.length) * 60;
        }

        // Fuzzy character match
        let qi = 0;
        for (let ti = 0; ti < t.length && qi < q.length; ti++) {
            if (t[ti] === q[qi]) qi++;
        }
        if (qi === q.length) return 30;

        return 0;
    },

    /**
     * Durchsucht alle Mythen nach einem Suchbegriff
     * Sucht in: mythos, kurzantwort, tags, erklaerung
     */
    search(query, mythen) {
        if (!query || query.trim().length < 2) return mythen;

        const q = query.trim();

        const scored = mythen.map(m => {
            // Gewichtete Suche über verschiedene Felder
            const scores = [
                this.fuzzyMatch(q, m.mythos) * 3,           // Mythos-Text: höchste Gewichtung
                this.fuzzyMatch(q, m.tags.join(' ')) * 2.5,  // Tags: hoch
                this.fuzzyMatch(q, m.kurzantwort) * 1.5,     // Kurzantwort: mittel
                this.fuzzyMatch(q, m.erklaerung) * 0.5,      // Erklärung: niedrig
                this.fuzzyMatch(q, m.kategorie) * 2          // Kategorie: hoch
            ];
            const maxScore = Math.max(...scores);
            return { mythos: m, score: maxScore };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(s => s.mythos);
    },

    /**
     * Filtert Mythen nach Kategorie
     */
    filterByCategory(mythen, kategorie) {
        if (!kategorie || kategorie === 'alle') return mythen;
        return mythen.filter(m => m.kategorie === kategorie);
    },

    /**
     * Kombinierte Suche + Filter
     */
    searchAndFilter(query, kategorie, mythen) {
        let results = this.search(query, mythen);
        results = this.filterByCategory(results, kategorie);
        return results;
    }
};

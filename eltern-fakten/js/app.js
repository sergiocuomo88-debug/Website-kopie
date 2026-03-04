/* ============================
   eltern-fakten – Main App Logic
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // Mobile Menu
    // ============================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('.nav-link').forEach(link =>
            link.addEventListener('click', () => nav.classList.remove('open'))
        );
    }

    // ============================
    // Helpers
    // ============================
    const BEWERTUNG_CONFIG = {
        stimmt: { label: 'Stimmt', icon: '✅', class: 'stimmt' },
        teilweise: { label: 'Teilweise', icon: '⚠️', class: 'teilweise' },
        falsch: { label: 'Falsch', icon: '❌', class: 'falsch' },
        unklar: { label: 'Unklar', icon: '❓', class: 'unklar' }
    };

    const KATEGORIE_CONFIG = {
        schlafen: { label: 'Schlafen', icon: '😴' },
        ernaehrung: { label: 'Ernährung', icon: '🍼' },
        gesundheit: { label: 'Gesundheit', icon: '🩺' },
        entwicklung: { label: 'Entwicklung', icon: '🧒' },
        hausmittel: { label: 'Hausmittel', icon: '🌿' },
        schwangerschaft: { label: 'Schwangerschaft', icon: '🤰' },
        pflege: { label: 'Pflege', icon: '🛁' }
    };

    function getBewertung(key) {
        return BEWERTUNG_CONFIG[key] || BEWERTUNG_CONFIG.unklar;
    }

    function getKategorie(key) {
        return KATEGORIE_CONFIG[key] || { label: key, icon: '📋' };
    }

    // ============================
    // Card Renderer
    // ============================
    function renderMythCard(m) {
        const b = getBewertung(m.bewertung);
        const k = getKategorie(m.kategorie);
        const emotionDots = Array.from({ length: 5 }, (_, i) =>
            `<span class="emotion-dot${i < m.emotion ? ' filled' : ''}"></span>`
        ).join('');

        return `
            <a href="mythos.html?id=${m.id}" class="mythos-card">
                <div class="mythos-card-header">
                    <span class="ampel-badge ${b.class}">${b.icon} ${b.label}</span>
                    <h3 class="mythos-card-title">${m.mythos}</h3>
                </div>
                <p class="mythos-card-snippet">${m.kurzantwort}</p>
                <div class="mythos-card-footer">
                    <span class="kategorie-tag">${k.icon} ${k.label}</span>
                    <div style="display:flex;align-items:center;gap:10px">
                        <div class="emotion-dots" title="Emotionalität: ${m.emotion}/5">${emotionDots}</div>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </a>
        `;
    }

    // ============================
    // INDEX PAGE: Search + Filter + Grid
    // ============================
    const grid = document.getElementById('mythen-grid');
    const searchInput = document.getElementById('search-input');
    const filterPills = document.getElementById('filter-pills');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    if (grid && searchInput) {
        let currentCategory = 'alle';
        let currentQuery = '';

        function updateGrid() {
            const results = Search.searchAndFilter(currentQuery, currentCategory, MythenDB);

            if (results.length === 0) {
                grid.innerHTML = '';
                noResults.classList.remove('hidden');
                resultsCount.textContent = '';
            } else {
                noResults.classList.add('hidden');
                grid.innerHTML = results.map(renderMythCard).join('');
                if (currentQuery || currentCategory !== 'alle') {
                    resultsCount.textContent = `${results.length} von ${MythenDB.length} Mythen`;
                } else {
                    resultsCount.textContent = '';
                }
            }
        }

        // Search input
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentQuery = searchInput.value;
                updateGrid();
            }, 200);
        });

        // Filter pills
        if (filterPills) {
            filterPills.addEventListener('click', (e) => {
                const pill = e.target.closest('.filter-pill');
                if (!pill) return;

                filterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = pill.dataset.category;
                updateGrid();
            });
        }

        // Footer category links
        document.querySelectorAll('[data-nav-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const cat = link.dataset.navCategory;
                currentCategory = cat;

                // Update pills
                if (filterPills) {
                    filterPills.querySelectorAll('.filter-pill').forEach(p => {
                        p.classList.toggle('active', p.dataset.category === cat);
                    });
                }

                updateGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Initial render
        updateGrid();

        // Focus search on page load (desktop only)
        if (window.innerWidth > 768) {
            searchInput.focus();
        }
    }

    // ============================
    // DETAIL PAGE: Mythos View
    // ============================
    const detailContent = document.getElementById('detail-content');
    const notFound = document.getElementById('not-found');
    const relatedSection = document.getElementById('related-section');
    const relatedGrid = document.getElementById('related-grid');

    if (detailContent) {
        const params = new URLSearchParams(window.location.search);
        const mythId = params.get('id');
        const mythos = MythenDB.find(m => m.id === mythId);

        if (!mythos) {
            detailContent.classList.add('hidden');
            notFound.classList.remove('hidden');
            if (relatedSection) relatedSection.classList.add('hidden');
            return;
        }

        // Update page title
        document.title = `„${mythos.mythos}" – eltern-fakten`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = mythos.kurzantwort;

        const b = getBewertung(mythos.bewertung);
        const k = getKategorie(mythos.kategorie);

        // Build quellen HTML
        const quellenHtml = mythos.quellen.map(q => `
            <li>
                <span>${q.name}</span>
                ${q.org ? `<span class="quellen-org"> — ${q.org}</span>` : ''}
            </li>
        `).join('');

        // Build erklaerung with paragraphs
        const erklaerungHtml = mythos.erklaerung
            .split('\n\n')
            .map(p => {
                // Handle bullet points
                if (p.includes('\n•')) {
                    const lines = p.split('\n');
                    const intro = lines[0];
                    const bullets = lines.slice(1).filter(l => l.startsWith('•'));
                    return `<p>${intro}</p><ul>${bullets.map(b => `<li>${b.slice(1).trim()}</li>`).join('')}</ul>`;
                }
                return `<p>${p}</p>`;
            })
            .join('');

        // DACH note
        const dpiHtml = mythos.dpiNote ? `
            <div class="content-card herkunft-card">
                <h3>🇩🇪 DACH-Kontext</h3>
                <p>${mythos.dpiNote}</p>
            </div>
        ` : '';

        // Ab wann
        const abWannHtml = mythos.abWann ? `
            <div class="ab-wann-badge">📅 ${mythos.abWann}</div>
        ` : '';

        detailContent.innerHTML = `
            <div class="detail-ampel ${b.class}">
                <span class="detail-ampel-icon">${b.icon}</span>
                ${b.label}
            </div>

            <h1 class="detail-mythos">„${mythos.mythos}"</h1>

            <div class="detail-meta">
                <span class="kategorie-tag">${k.icon} ${k.label}</span>
                <span class="kategorie-tag" title="Emotionalität">🔥 ${mythos.emotion}/5</span>
            </div>

            <!-- Kurzantwort -->
            <div class="content-card kurzantwort-card ${b.class}">
                <p>${mythos.kurzantwort}</p>
                ${abWannHtml}
            </div>

            <!-- Ausführliche Erklärung -->
            <div class="content-card">
                <h3>📖 Was sagt die Forschung?</h3>
                ${erklaerungHtml}
            </div>

            <!-- Quellen -->
            <div class="content-card">
                <h3>📚 Quellen</h3>
                <ul class="quellen-list">
                    ${quellenHtml}
                </ul>
            </div>

            <!-- Herkunft -->
            <div class="content-card herkunft-card">
                <h3>🔍 Woher kommt dieser Mythos?</h3>
                <p>${mythos.herkunft}</p>
            </div>

            ${dpiHtml}

            <!-- Share -->
            <div class="share-section">
                <button class="share-btn" id="share-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Teilen
                </button>
                <p class="share-subtitle">Schick den Link an deine Schwiegermutter 😉</p>
            </div>

            <!-- Disclaimer -->
            <div class="disclaimer">
                <strong>Hinweis:</strong> Diese Einordnung basiert auf aktuellen wissenschaftlichen Quellen und Leitlinien. Sie ersetzt keine individuelle ärztliche Beratung. Bei gesundheitlichen Fragen zu deinem Kind wende dich an deine Kinderärztin oder deinen Kinderarzt.
            </div>
        `;

        // Share button logic
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const shareData = {
                    title: `Mythos-Check: „${mythos.mythos}"`,
                    text: `${b.icon} ${b.label}: ${mythos.kurzantwort}`,
                    url: window.location.href
                };

                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else {
                        await navigator.clipboard.writeText(
                            `${b.icon} ${b.label}: „${mythos.mythos}"\n\n${mythos.kurzantwort}\n\n${window.location.href}`
                        );
                        shareBtn.innerHTML = `✓ Link kopiert!`;
                        shareBtn.classList.add('copied');
                        setTimeout(() => {
                            shareBtn.innerHTML = `
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                </svg>
                                Teilen
                            `;
                            shareBtn.classList.remove('copied');
                        }, 2000);
                    }
                } catch (err) {
                    // User cancelled share
                }
            });
        }

        // Related myths
        if (relatedSection && relatedGrid && mythos.verwandt && mythos.verwandt.length > 0) {
            const related = mythos.verwandt
                .map(id => MythenDB.find(m => m.id === id))
                .filter(Boolean);

            if (related.length > 0) {
                relatedGrid.innerHTML = related.map(renderMythCard).join('');
            } else {
                relatedSection.classList.add('hidden');
            }
        } else if (relatedSection) {
            // No related myths defined, show some from same category
            const sameCategory = MythenDB
                .filter(m => m.kategorie === mythos.kategorie && m.id !== mythos.id)
                .slice(0, 3);

            if (sameCategory.length > 0) {
                relatedGrid.innerHTML = sameCategory.map(renderMythCard).join('');
            } else {
                relatedSection.classList.add('hidden');
            }
        }
    }
});

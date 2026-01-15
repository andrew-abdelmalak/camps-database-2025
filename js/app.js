// ============================================
// Camps Database 2025 - Application Logic
// Features: Fuzzy Search (Arabic/English/Arabizi), Responsive Grid
// ============================================

// Data
const venues = window.venues || [];

// DOM Elements
const venueGrid = document.getElementById('venueGrid');
const searchInput = document.getElementById('searchInput');
const locCheckboxesContainer = document.getElementById('locCheckboxes');
const noResults = document.getElementById('noResults');
const venueCountEl = document.getElementById('venueCount');

// State
const carouselStates = {};
let modalImages = [];
let modalIndex = 0;
let currentModalCardId = null; // Track which card opened the modal
let fuse = null; // Fuse.js instance
let currentTab = 'favorites'; // Current active tab - default to favorites

// Favorite venue IDs (the 4 shortlisted venues)
const FAVORITE_IDS = ['17', '42', '25', '26'];

// ============================================
// VENUE QUALIFICATION SYSTEM (REMOVED)
// Now using simple favorites-based tabs instead
// ============================================

// ============================================
// ARABIZI (Franco-Arab) to Arabic Mapping
// ============================================
const arabiziMap = {
    // Numbers to Arabic letters
    '2': 'ء', '3': 'ع', '5': 'خ', '6': 'ط', '7': 'ح', '8': 'ق', '9': 'ص',
    // Common transliterations
    'sh': 'ش', 'ch': 'ش', 'kh': 'خ', 'gh': 'غ', 'th': 'ث', 'dh': 'ذ',
    'aa': 'ا', 'ee': 'ي', 'oo': 'و', 'ou': 'و',
    // Common word mappings (locations)
    'suez': 'السويس', 'ismailia': 'الإسماعيلية', 'ismailya': 'الإسماعيلية',
    'natroun': 'النطرون', 'natrun': 'النطرون', 'wadi': 'وادي',
    'fayed': 'فايد', 'fayid': 'فايد',
    'sokhna': 'السخنة', 'ain sokhna': 'السخنة', 'sakhneh': 'السخنة',
    'sadat': 'السادات', 'madinat': 'مدينة',
    'obour': 'العبور', 'obor': 'العبور', '3obor': 'العبور',
    'shorouk': 'الشروق', 'shorok': 'الشروق', 'shrouk': 'الشروق',
    'mokattam': 'المقطم', 'mo2attam': 'المقطم', 'muqattam': 'المقطم',
    'fayoum': 'الفيوم', 'fayom': 'الفيوم', 'fayyum': 'الفيوم',
    'ras sidr': 'راس سدر', 'ras sedr': 'راس سدر',
    'king mariut': 'كينج مريوط', 'king maryut': 'كينج مريوط',
    'sidi krir': 'سيدي كرير', 'sidi kreir': 'سيدي كرير',
    'alamein': 'العلمين', 'el alamein': 'العلمين',
    'abu talat': 'أبو تلات', 'abu tlat': 'أبو تلات',
    'european': 'الريف الأوروبي', 'rif': 'الريف',
    '3arabi': 'عرابي', 'arabi': 'عرابي', 'araby': 'عرابي',
    'port fouad': 'بورفؤاد', 'borfouad': 'بورفؤاد',
    // Common words
    'beit': 'بيت', 'bet': 'بيت', 'bayt': 'بيت',
    'el': 'ال', 'al': 'ال',
    'mar': 'مار', 'sant': 'سانت', 'saint': 'سانت',
    'george': 'جرجس', 'girgis': 'جرجس', 'gergis': 'جرجس',
    'mary': 'مريم', 'maryam': 'مريم', 'mariam': 'مريم',
    'adra': 'العذراء', '3adra': 'العذراء', 'virgin': 'العذراء',
    'youssef': 'يوسف', 'yousef': 'يوسف', 'joseph': 'يوسف',
    'nagar': 'النجار', 'najar': 'النجار', 'carpenter': 'النجار',
    'anba': 'أنبا', 'amba': 'أنبا', 'abba': 'أنبا',
    'mina': 'مينا', 'antonios': 'أنطونيوس', 'antony': 'أنطونيوس',
    'church': 'كنيسة', 'kanisa': 'كنيسة', 'kanesa': 'كنيسة',
    'camp': 'معسكر', 'mo3askar': 'معسكر',
    'pool': 'حمام سباحة', 'hammam': 'حمام',
    'playground': 'ملعب', 'mal3ab': 'ملعب',
    'wifi': 'واي فاي', 'internet': 'انترنت',
    // Single letter mappings (applied last)
    'a': 'ا', 'b': 'ب', 't': 'ت', 'g': 'ج', 'j': 'ج',
    'h': 'ه', 'd': 'د', 'r': 'ر', 'z': 'ز', 's': 'س',
    'c': 'ك', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل',
    'm': 'م', 'n': 'ن', 'w': 'و', 'y': 'ي'
};

// Convert Arabizi to Arabic
function arabiziToArabic(text) {
    if (!text) return '';
    let result = text.toLowerCase();

    // Sort keys by length (longest first) to avoid partial replacements
    const sortedKeys = Object.keys(arabiziMap).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        const regex = new RegExp(key, 'gi');
        result = result.replace(regex, arabiziMap[key]);
    }

    return result;
}

// Normalize Arabic text (remove diacritics, normalize alef/ya)
function normalizeArabic(text) {
    if (!text) return '';
    return text
        .replace(/[\u064B-\u065F]/g, '') // Remove diacritics
        .replace(/[أإآ]/g, 'ا') // Normalize Alef
        .replace(/ى/g, 'ي') // Normalize Ya
        .replace(/ة/g, 'ه') // Normalize Ta Marbuta
        .toLowerCase();
}

// Prepare search query (normalize + convert Arabizi)
function prepareSearchQuery(query) {
    const normalized = normalizeArabic(query);
    const arabicVersion = arabiziToArabic(query);
    const normalizedArabic = normalizeArabic(arabicVersion);

    // Return both versions for multi-language matching
    return {
        original: query.toLowerCase(),
        normalized: normalized,
        arabic: normalizedArabic
    };
}

// ============================================
// Fuse.js Setup
// ============================================
function initFuse() {
    // Create searchable text for each venue (adapted for new schema)
    const searchableVenues = venues.map(v => {
        // Convert amenities object to text
        const amenitiesText = v.amenities ? Object.entries(v.amenities)
            .filter(([k, val]) => val > 0)
            .map(([k]) => window.SCHEMA?.AMENITY_DISPLAY?.[k]?.name || k)
            .join(' ') : '';

        return {
            ...v,
            searchText: [
                v.name,
                v.location,
                v.notes,
                v.details,
                ...(v.phones || []).map(p => p.name || p.number),
                amenitiesText,
                ...(v.links || []).map(l => window.SCHEMA?.LINK_TYPES?.[l.type]?.text || l.type)
            ].filter(Boolean).join(' ')
        };
    });

    fuse = new Fuse(searchableVenues, {
        keys: [
            { name: 'name', weight: 0.4 },
            { name: 'location', weight: 0.3 },
            { name: 'searchText', weight: 0.3 }
        ],
        threshold: 0.4, // More forgiving fuzzy matching
        ignoreLocation: true,
        includeScore: true,
        minMatchCharLength: 2,
        findAllMatches: true,
        useExtendedSearch: true
    });
}

// ============================================
// Initialize
// ============================================
function init() {
    try {
        // Show skeleton loading first
        showSkeletonLoading();
    } catch (e) { }

    // Delay actual content for perceived performance
    setTimeout(() => {
        try {
            // Count favorites and rest
            const favorites = venues.filter(v => FAVORITE_IDS.includes(v.id));
            const rest = venues.filter(v => !FAVORITE_IDS.includes(v.id));

            // Update tab counts
            document.getElementById('favoritesCount').textContent = favorites.length;
            document.getElementById('restCount').textContent = rest.length;

            initFuse();
            setupTabListeners();
            filterVenues(); // Renders venues based on current tab
            setupEventListeners();
            setupModal();
            updateLastUpdated();
            restoreScrollPosition();
            restoreCarouselStates();
            setupScrollPersistence();
        } catch (e) { }
    }, 300);
}

// Tab switching
function setupTabListeners() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current tab
            currentTab = btn.dataset.tab;

            // Re-filter venues
            filterVenues();
        });
    });
}

function updateVenueCount(count) {
    venueCountEl.textContent = `📍 ${count} بيت`;
}

// ============================================
// Render Venues
// ============================================
// ============================================
// Render Venues (JS Masonry)
// ============================================
let resizeTimeout;
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
    // Ignore vertical resize (address bar toggle on mobile)
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-render only if column count would change, or just simple re-render
        renderVenues(currentVenues); // We need to store current filtered venues globally or re-filter
    }, 200);
});

// Store current filtered venues to allow re-rendering
let currentVenues = [];

function renderVenues(venuesData) {
    currentVenues = venuesData;
    venueGrid.innerHTML = '';

    if (venuesData.length === 0) {
        noResults.classList.add('show');
        return;
    }

    noResults.classList.remove('show');

    // 1. Determine Column Count
    const width = window.innerWidth;
    let colCount = 1;
    if (width >= 1600) colCount = 4;
    else if (width >= 1200) colCount = 3;
    else if (width >= 768) colCount = 2;

    // 2. Create Columns
    const columns = [];
    for (let i = 0; i < colCount; i++) {
        const col = document.createElement('div');
        col.className = 'masonry-col';
        columns.push(col);
        venueGrid.appendChild(col);
    }

    // 3. Distribute Cards into Columns (Row by Row order)
    venuesData.forEach((venue, index) => {
        const card = document.createElement('div');
        card.className = `venue-card ${venue.status || ''}`;
        card.dataset.location = venue.location;
        card.dataset.status = venue.status || '';
        card.id = `card-${venue.id}`;

        const locClass = getLocClass(venue.location);

        // Header
        let headerHtml = `
            <div class="card-header ${locClass}">
                <h3 class="venue-name">${venue.name}</h3>
            </div>
        `;

        // Carousel with intelligent lazy loading
        let carouselHtml = '';
        if (venue.images && venue.images.length > 0) {
            const slidesHtml = venue.images.map((img, idx) => `
                <div class="slide ${idx === 0 ? 'active' : ''}">
                    <img class="lazy" data-src="${img}" alt="${venue.name} - ${idx + 1}" data-index="${idx}" data-venue="${venue.id}">
                </div>
            `).join('');

            carouselHtml = `
                <div class="carousel" data-card="${venue.id}" data-images='${JSON.stringify(venue.images)}'>
                    <div class="slides">${slidesHtml}</div>
                    ${venue.images.length > 1 ? `
                    <button class="nav-btn prev">❮</button>
                    <button class="nav-btn next">❯</button>
                    <div class="counter"><span class="current">1</span>/${venue.images.length}</div>
                    ` : ''}
                </div>
            `;
        }

        // Location
        const locationHtml = `
            <div class="venue-row">
                <span class="venue-label">📍 الموقع</span>
                <span class="venue-value">${venue.location}</span>
            </div>
        `;

        // Phones - inline with name (new schema)
        const phonesHtml = venue.phones && venue.phones.length > 0 ? `
            <div class="venue-row venue-row-phones">
                <span class="venue-label">📞 التليفون</span>
                <div class="phone-items-wrapper">
                    ${venue.phones.map(p => `<a href="tel:${p.number}" class="phone-item">
                            <span class="phone-number">${p.number}</span>
                            ${p.name ? `<span class="phone-contact">${p.name}</span>` : ''}
                        </a>`).join('')}
                </div>
            </div>
        ` : '';

        // Links - use type from schema (new schema)
        const linksHtml = venue.links && venue.links.length > 0 ? `
            <div class="venue-row venue-row-links">
                <span class="venue-label">🔗 اللينكات</span>
                <div class="links-items-wrapper">
                    ${venue.links.map(l => {
            const linkInfo = window.SCHEMA?.LINK_TYPES?.[l.type] || {};
            const label = linkInfo.text || l.type || 'رابط';
            const icon = linkInfo.icon || '🔗';
            return `<a href="${l.url}" target="_blank" class="link-item">${icon} ${label}</a>`;
        }).join('')}
                </div>
            </div>
        ` : '';

        // Price - render from new structured pricing object
        let priceHtml = '';
        if (venue.pricing) {
            const priceBadges = [];
            const periods = { night: '/ليلة', day: '/يوم', hour: '/ساعة' };
            for (const [type, priceInfo] of Object.entries(venue.pricing)) {
                if (!priceInfo) continue;
                let text = '';
                if (priceInfo.min && priceInfo.max) {
                    text = `${priceInfo.min}-${priceInfo.max}ج`;
                } else if (priceInfo.amount) {
                    text = `${priceInfo.amount}ج`;
                }
                if (priceInfo.period) text += periods[priceInfo.period] || '';
                if (priceInfo.includes && priceInfo.includes.length > 0) {
                    text += ' شامل';
                }
                if (text) priceBadges.push(`<span class="price-badge">${text}</span>`);
            }
            if (priceBadges.length > 0) {
                priceHtml = `
                    <div class="venue-row venue-row-price">
                        <span class="venue-label">💰 السعر</span>
                        <div class="price-items-wrapper">${priceBadges.join('')}</div>
                    </div>
                `;
            }
        }

        // Capacity - render from new structured capacity object
        let capacityHtml = '';
        if (venue.capacity) {
            const capacityBadges = [];
            if (venue.capacity.camping) capacityBadges.push(`<span class="capacity-badge">~${venue.capacity.camping} فرد</span>`);
            if (venue.capacity.beds) capacityBadges.push(`<span class="capacity-badge">${venue.capacity.beds} سرير</span>`);
            if (capacityBadges.length > 0) {
                capacityHtml = `
                    <div class="venue-row venue-row-capacity">
                        <span class="venue-label">👥 السعة</span>
                        <div class="capacity-badges">${capacityBadges.join('')}</div>
                    </div>
                `;
            }
        }

        // Facilities - use V3 icons if available, fallback to legacy amenities
        const facilityIcons = {
            campground: '🏕️ أرض معسكر',
            camping: '⛺ تخييم',
            rooms: '🛏️ مبيت',
            kitchen: '🍳 مطبخ',
            bathrooms: '🚿 حمامات',
            church: '⛪ كنيسة',
            halls: '🏛️ قاعات',
            sportsFields: '⚽ ملاعب',
            pool: '🏊 حمام سباحة',
            theater: '🎭 مسرح',
            pergolas: '⛱️ برجولات',
            canteen: '🏪 كانتين',
            airConditioning: '❄️ تكييف',
            playground: '🎠 ألعاب',
            beach: '🌊 بحر',
            bbq: '🔥 شواية',
            waterCooler: '💧 كولدير'
        };

        // Amenities - render from new number-based object
        let amenitiesHtml = '';
        if (venue.amenities && typeof venue.amenities === 'object') {
            const amenityItems = [];
            for (const [key, count] of Object.entries(venue.amenities)) {
                if (count === 0) continue; // Skip if not present
                const display = window.SCHEMA?.AMENITY_DISPLAY?.[key] || facilityIcons[key];
                if (!display) continue;
                const icon = display.icon || '';
                const name = display.name || key;
                // 1 = just show icon+name, 2+ = show count
                const text = count > 1 ? `${icon} ${count} ${name}` : `${icon} ${name}`;
                amenityItems.push(`<span class="amenity">${text}</span>`);
            }
            if (amenityItems.length > 0) {
                amenitiesHtml = `
                    <div class="amenities">
                        ${amenityItems.join('')}
                    </div>
                `;
            }
        }

        // Notes
        const notesHtml = venue.notes ? `
            <div class="notes ${venue.notesType || ''}">${venue.notes}</div>
        ` : '';

        // Details - simple display (no V5/V6 parsing)
        const detailsHtml = venue.details ? `
            <div class="details">${venue.details}</div>
        ` : '';

        card.innerHTML = `
            ${headerHtml}
            <div class="card-body">
                ${carouselHtml}
                ${locationHtml}
                ${phonesHtml}
                ${linksHtml}
                ${priceHtml}
                ${capacityHtml}
                ${amenitiesHtml}
                ${notesHtml}
                ${detailsHtml}
            </div>
        `;

        // Smart Column Assignment (Balanced Masonry)
        // - Top row (first colCount items): Strict sequential for R-L sorting
        // - After that: Place in shortest column to balance heights
        if (index < colCount) {
            // Top row: strict order (0, 1, 2, 3...)
            columns[index].appendChild(card);
        } else {
            // Find the shortest column
            let shortestCol = columns[0];
            let minHeight = columns[0].offsetHeight;
            for (let i = 1; i < columns.length; i++) {
                const h = columns[i].offsetHeight;
                if (h < minHeight) {
                    minHeight = h;
                    shortestCol = columns[i];
                }
            }
            shortestCol.appendChild(card);
        }

        // Setup Carousel Events with smart image loading
        if (venue.images && venue.images.length > 0) {
            setupSmartImageLoading(card, venue.images);
            if (venue.images.length > 1) {
                setupCarousel(card, venue.id, venue.images.length);
            }
        }

        // Fullscreen Image Event - pass venue.id for syncing back
        card.querySelectorAll('.slide img').forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(venue.images, index, venue.id);
            });
        });
    });
}

function getLocClass(location) {
    const map = {
        'العبور': 'loc-obour',
        'وادي النطرون': 'loc-natroun',
        'أبو تلات': 'loc-abutalat',
        'فايد': 'loc-fayed',
        'الشروق': 'loc-shorouk',
        'السويس': 'loc-suez',
        'مدينة السادات': 'loc-sadat',
        'طريق السويس': 'loc-suez',
        'الإسماعيلية': 'loc-suez',
    };
    return map[location] || 'loc-other';
}

// ============================================
// Carousel Logic
// ============================================
function setupCarousel(card, cardId, totalSlides) {
    const carousel = card.querySelector('.carousel');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const slides = carousel.querySelectorAll('.slide');
    const counter = carousel.querySelector('.current');

    carouselStates[cardId] = 0;

    function updateSlide(newIndex) {
        slides[carouselStates[cardId]].classList.remove('active');
        carouselStates[cardId] = (newIndex + totalSlides) % totalSlides;
        slides[carouselStates[cardId]].classList.add('active');
        counter.textContent = carouselStates[cardId] + 1;
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlide(carouselStates[cardId] - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlide(carouselStates[cardId] + 1);
    });
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', filterVenues);
    }

    // Location Filter Toggle (optional element)
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            const checkboxes = document.getElementById('locCheckboxes');
            if (checkboxes) {
                checkboxes.classList.toggle('hidden');
                const isHidden = checkboxes.classList.contains('hidden');
                filterToggle.textContent = isHidden ? '📍 فلتر المواقع ▶' : '📍 فلتر المواقع ▼';
                filterToggle.classList.toggle('active', !isHidden);
            }
        });
    }

    // Checkboxes (optional elements)
    const selectAll = document.getElementById('selectAllLocs');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            document.querySelectorAll('.loc-checkbox:not(.select-all) input').forEach(cb => {
                cb.checked = e.target.checked;
            });
            saveLocationFilters();
            filterVenues();
        });
    }

    document.querySelectorAll('.loc-checkbox:not(.select-all) input').forEach(cb => {
        cb.addEventListener('change', () => {
            const allDocs = document.querySelectorAll('.loc-checkbox:not(.select-all) input');
            const allChecked = Array.from(allDocs).every(c => c.checked);
            if (selectAll) selectAll.checked = allChecked;
            saveLocationFilters();
            filterVenues();
        });
    });
}

// ============================================
// Filter Logic with Simple Arabic Title Search + Auto Tab Switch
// ============================================
let searchTimeout = null;

function filterVenues() {
    const rawQuery = searchInput.value.trim();

    // Update tab counts based on search query
    updateTabCounts(rawQuery);

    // First filter by current tab (favorites or rest)
    let matchedVenues;
    if (currentTab === 'favorites') {
        matchedVenues = venues.filter(v => FAVORITE_IDS.includes(v.id));
    } else {
        matchedVenues = venues.filter(v => !FAVORITE_IDS.includes(v.id));
    }

    // Apply simple Arabic title search if query exists
    if (rawQuery.length >= 2) {
        // Simple includes() search on venue name only
        matchedVenues = matchedVenues.filter(v =>
            v.name && v.name.includes(rawQuery)
        );

        // If no results in current tab, check other tabs and auto-switch
        if (matchedVenues.length === 0) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // Search in all venues regardless of tab
                const allMatches = venues.filter(v =>
                    v.name && v.name.includes(rawQuery)
                );

                if (allMatches.length > 0) {
                    // Find which tab has the first match
                    const firstMatch = allMatches[0];
                    const isFavorite = FAVORITE_IDS.includes(firstMatch.id);
                    const targetTab = isFavorite ? 'favorites' : 'rest';

                    if (targetTab !== currentTab) {
                        // Switch to the tab containing the result
                        const tabBtns = document.querySelectorAll('.tab-btn');
                        tabBtns.forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.dataset.tab === targetTab) {
                                btn.classList.add('active');
                            }
                        });
                        currentTab = targetTab;
                        filterVenues(); // Re-filter with new tab
                    }
                }
            }, 500); // 500ms delay before auto-switching
        }
    }

    // Render results
    renderVenues(matchedVenues);
    updateVenueCount(matchedVenues.length);
}

// Update tab counts based on search query
function updateTabCounts(query) {
    let favoritesCount, restCount;

    if (query.length >= 2) {
        // Count venues matching search in each tab
        favoritesCount = venues.filter(v =>
            FAVORITE_IDS.includes(v.id) &&
            v.name && v.name.includes(query)
        ).length;
        restCount = venues.filter(v =>
            !FAVORITE_IDS.includes(v.id) &&
            v.name && v.name.includes(query)
        ).length;
    } else {
        // No search, count all venues in each tab
        favoritesCount = venues.filter(v => FAVORITE_IDS.includes(v.id)).length;
        restCount = venues.filter(v => !FAVORITE_IDS.includes(v.id)).length;
    }

    const favCountEl = document.getElementById('favoritesCount');
    const restCountEl = document.getElementById('restCount');
    if (favCountEl) favCountEl.textContent = favoritesCount;
    if (restCountEl) restCountEl.textContent = restCount;
}

// ============================================
// LocalStorage for Filters
// ============================================
function saveLocationFilters() {
    const checkboxes = document.querySelectorAll('.loc-checkbox:not(.select-all) input');
    const state = {};
    checkboxes.forEach(cb => {
        state[cb.value] = cb.checked;
    });
    try {
        localStorage.setItem('campsdb_loc_filters', JSON.stringify(state));
    } catch (e) { }
}

function restoreLocationFilters() {
    try {
        const saved = localStorage.getItem('campsdb_loc_filters');
        if (saved) {
            const state = JSON.parse(saved);
            const checkboxes = document.querySelectorAll('.loc-checkbox:not(.select-all) input');
            checkboxes.forEach(cb => {
                if (state.hasOwnProperty(cb.value)) {
                    cb.checked = state[cb.value];
                }
            });
            const allChecked = Array.from(checkboxes).every(c => c.checked);
            document.getElementById('selectAllLocs').checked = allChecked;
        }
    } catch (e) { }
}

// ============================================
// Modal Logic
// ============================================
function setupModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    // Close when clicking backdrop (the modal background itself)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Direct event listener on close button
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    // Direct event listener on prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (modalImages.length === 0) return;
            modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
            updateModalImage();
            syncCarouselToModal();
        });
    }

    // Direct event listener on next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (modalImages.length === 0) return;
            modalIndex = (modalIndex + 1) % modalImages.length;
            updateModalImage();
            syncCarouselToModal();
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') {
            if (modalImages.length === 0) return;
            modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
            updateModalImage();
            syncCarouselToModal();
        }
        if (e.key === 'ArrowRight') {
            if (modalImages.length === 0) return;
            modalIndex = (modalIndex + 1) % modalImages.length;
            updateModalImage();
            syncCarouselToModal();
        }
    });
}

function openModal(images, index, cardId) {
    if (!images || images.length === 0) return;
    modalImages = images;
    modalIndex = index || 0;
    currentModalCardId = cardId || null; // Store which card opened the modal
    updateModalImage();
    document.getElementById('imageModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function updateModalImage() {
    document.getElementById('modalImage').src = modalImages[modalIndex];
    document.getElementById('modalCurrent').textContent = modalIndex + 1;
    document.getElementById('modalTotal').textContent = modalImages.length;
}

// Sync the card carousel to match the modal's current image
function syncCarouselToModal() {
    if (!currentModalCardId) return;

    const card = document.getElementById(`card-${currentModalCardId}`);
    if (!card) return;

    const slides = card.querySelectorAll('.slide');
    const counter = card.querySelector('.current');

    if (slides.length === 0) return;

    // Remove active from all slides
    slides.forEach(slide => slide.classList.remove('active'));

    // Set the matching slide as active
    if (slides[modalIndex]) {
        slides[modalIndex].classList.add('active');
        carouselStates[currentModalCardId] = modalIndex;
        if (counter) counter.textContent = modalIndex + 1;

        // Trigger image loading for the new slide
        loadImageIntelligently(currentModalCardId, modalImages, modalIndex);

        // Save carousel state
        saveCarouselStates();
    }
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
    document.body.style.overflow = '';
    currentModalCardId = null;
}

// ============================================
// Skeleton Loading
// ============================================
function showSkeletonLoading() {
    const width = window.innerWidth;
    let colCount = 1;
    if (width >= 1600) colCount = 4;
    else if (width >= 1200) colCount = 3;
    else if (width >= 768) colCount = 2;

    let skeletonHtml = '';
    for (let i = 0; i < colCount; i++) {
        skeletonHtml += '<div class="masonry-col">';
        for (let j = 0; j < 3; j++) {
            skeletonHtml += `
                <div class="skeleton-card">
                    <div class="skeleton-header"></div>
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton skeleton-line medium"></div>
                    <div class="skeleton skeleton-line short"></div>
                    <div class="skeleton-amenities">
                        <div class="skeleton skeleton-tag"></div>
                        <div class="skeleton skeleton-tag"></div>
                        <div class="skeleton skeleton-tag"></div>
                    </div>
                </div>
            `;
        }
        skeletonHtml += '</div>';
    }
    venueGrid.innerHTML = skeletonHtml;
}

// ============================================
// Scroll Position Persistence
// ============================================
function setupScrollPersistence() {
    let scrollTicking = false;

    // Save scroll position periodically (throttled)
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                saveScrollPosition();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Also save before page unload
    window.addEventListener('beforeunload', () => {
        saveScrollPosition();
        saveCarouselStates();
    });
}

function saveScrollPosition() {
    try {
        localStorage.setItem('campsdb_scroll_pos', JSON.stringify({
            y: window.scrollY,
            timestamp: Date.now()
        }));
    } catch (e) { }
}

function restoreScrollPosition() {
    try {
        const saved = localStorage.getItem('campsdb_scroll_pos');
        if (saved) {
            const data = JSON.parse(saved);
            // Only restore if saved within last 30 minutes
            if (Date.now() - data.timestamp < 30 * 60 * 1000) {
                setTimeout(() => {
                    window.scrollTo({
                        top: data.y,
                        behavior: 'instant'
                    });
                }, 100);
            }
        }
    } catch (e) { }
}

// ============================================
// Carousel State Persistence
// ============================================
function saveCarouselStates() {
    try {
        localStorage.setItem('campsdb_carousel_states', JSON.stringify({
            states: carouselStates,
            timestamp: Date.now()
        }));
    } catch (e) { }
}

function restoreCarouselStates() {
    try {
        const saved = localStorage.getItem('campsdb_carousel_states');
        if (saved) {
            const data = JSON.parse(saved);
            // Only restore if saved within last 30 minutes
            if (Date.now() - data.timestamp < 30 * 60 * 1000 && data.states) {
                Object.keys(data.states).forEach(cardId => {
                    const savedIndex = data.states[cardId];
                    const card = document.getElementById(`card-${cardId}`);
                    if (card) {
                        const slides = card.querySelectorAll('.slide');
                        const counter = card.querySelector('.current');

                        if (slides.length > savedIndex) {
                            // Remove active from all
                            slides.forEach(s => s.classList.remove('active'));
                            // Set saved slide as active
                            slides[savedIndex].classList.add('active');
                            carouselStates[cardId] = savedIndex;
                            if (counter) counter.textContent = savedIndex + 1;
                        }
                    }
                });
            }
        }
    } catch (e) { }
}

// ============================================
// Last Updated Date
// ============================================
function updateLastUpdated() {
    const lastUpdatedEl = document.getElementById('lastUpdated');
    // Get the current date formatted in Arabic
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('ar-EG', options);
    lastUpdatedEl.textContent = `آخر تحديث: ${dateStr}`;
}

// ============================================
// Intelligent Image Preloading
// ============================================
const imageLoadedMap = new Map(); // Track loaded images per venue

function setupSmartImageLoading(card, images) {
    const carousel = card.querySelector('.carousel');
    if (!carousel) return;

    const cardId = carousel.dataset.card;
    imageLoadedMap.set(cardId, new Set());

    // Use Intersection Observer for viewport detection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load first image immediately when visible
                loadImageIntelligently(cardId, images, 0);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '100px' });

    observer.observe(carousel);
}

function loadImageIntelligently(cardId, images, currentIndex) {
    const loadedSet = imageLoadedMap.get(cardId) || new Set();

    // Priority order: current → next → previous
    const loadOrder = [
        currentIndex,
        (currentIndex + 1) % images.length,
        (currentIndex - 1 + images.length) % images.length
    ];

    loadOrder.forEach((idx, priority) => {
        if (!loadedSet.has(idx)) {
            setTimeout(() => {
                loadSingleImage(cardId, images[idx], idx);
            }, priority * 150); // Stagger loading
        }
    });
}

function loadSingleImage(cardId, src, index) {
    const imgEl = document.querySelector(`img[data-venue="${cardId}"][data-index="${index}"]`);
    if (!imgEl || imgEl.classList.contains('loaded')) return;

    const loadedSet = imageLoadedMap.get(cardId);

    // Create hidden image to preload
    const preloader = new Image();
    preloader.onload = () => {
        imgEl.src = src;
        imgEl.classList.remove('lazy');
        imgEl.classList.add('loaded');
        if (loadedSet) loadedSet.add(index);
    };
    preloader.onerror = () => {
        // Still show image on error (might work)
        imgEl.src = src;
        imgEl.classList.remove('lazy');
    };
    preloader.src = src;
}

// Enhance carousel navigation to trigger smart loading
const originalSetupCarousel = setupCarousel;
setupCarousel = function (card, cardId, totalSlides) {
    const carousel = card.querySelector('.carousel');
    const images = JSON.parse(carousel.dataset.images || '[]');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const slides = carousel.querySelectorAll('.slide');
    const counter = carousel.querySelector('.current');

    carouselStates[cardId] = 0;

    function updateSlide(newIndex) {
        slides[carouselStates[cardId]].classList.remove('active');
        carouselStates[cardId] = (newIndex + totalSlides) % totalSlides;
        slides[carouselStates[cardId]].classList.add('active');
        counter.textContent = carouselStates[cardId] + 1;

        // Trigger intelligent preloading for adjacent images
        loadImageIntelligently(cardId, images, carouselStates[cardId]);

        // Save carousel state to localStorage
        saveCarouselStates();
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlide(carouselStates[cardId] - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlide(carouselStates[cardId] + 1);
    });
};

// ============================================
// Start
// ============================================
init();

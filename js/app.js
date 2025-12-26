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
let currentModalCardId = null; // Track which card's modal is open
let fuse = null; // Fuse.js instance

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
    // Create searchable text for each venue
    const searchableVenues = venues.map(v => ({
        ...v,
        searchText: [
            v.name,
            v.location,
            v.notes,
            v.details,
            v.price,
            v.capacity,
            ...(v.phones || []).map(p => p.label || p.number),
            ...(v.amenities || []),
            ...(v.links || []).map(l => l.label)
        ].filter(Boolean).join(' ')
    }));

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
    // Show skeleton loading first
    showSkeletonLoading();

    // Delay actual content for perceived performance
    setTimeout(() => {
        initFuse();
        restoreLocationFilters();
        restoreCarouselStates(); // Restore saved carousel positions
        renderVenues(venues);
        updateVenueCount(venues.length);
        setupEventListeners();
        setupModal();
        restoreScrollPosition(); // Restore scroll after render
        setupScrollPersistence(); // Save scroll on change
        updateLastUpdated();
    }, 300);
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
window.addEventListener('resize', () => {
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
            // Check for saved carousel state
            const savedIndex = carouselStates[venue.id] || 0;
            const slidesHtml = venue.images.map((img, idx) => `
                <div class="slide ${idx === savedIndex ? 'active' : ''}">
                    <img class="lazy" data-src="${img}" alt="${venue.name} - ${idx + 1}" data-index="${idx}" data-venue="${venue.id}">
                </div>
            `).join('');

            carouselHtml = `
                <div class="carousel" data-card="${venue.id}" data-images='${JSON.stringify(venue.images)}'>
                    <div class="slides">${slidesHtml}</div>
                    ${venue.images.length > 1 ? `
                    <button class="nav-btn prev">❮</button>
                    <button class="nav-btn next">❯</button>
                    <div class="counter"><span class="current">${savedIndex + 1}</span>/${venue.images.length}</div>
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

        // Phones
        const phonesHtml = venue.phones && venue.phones.length > 0 ? `
            <div class="venue-row">
                <span class="venue-label">📞 التليفون</span>
                <span class="venue-value">
                    ${venue.phones.map(p => `<a href="tel:${p.number}">${p.label || p.number}</a>`).join(' / ')}
                </span>
            </div>
        ` : '';

        // Links
        const linksHtml = venue.links && venue.links.length > 0 ? `
            <div class="venue-row">
                <span class="venue-label">🔗 اللينكات</span>
                <span class="venue-value">
                    ${venue.links.map(l => `<a href="${l.url}" target="_blank">${l.label || 'رابط'}</a>`).join(' | ')}
                </span>
            </div>
        ` : '';

        // Price
        const priceHtml = venue.price ? `
            <div class="venue-row">
                <span class="venue-label">💰 السعر</span>
                <span class="venue-value"><span class="price-tag">${venue.price}</span></span>
            </div>
        ` : '';

        // Capacity
        const capacityHtml = venue.capacity ? `
            <div class="venue-row">
                <span class="venue-label">👥 السعة</span>
                <span class="venue-value">${venue.capacity}</span>
            </div>
        ` : '';

        // Amenities
        const amenitiesHtml = venue.amenities && venue.amenities.length > 0 ? `
            <div class="amenities">
                ${venue.amenities.map(a => `<span class="amenity">${a}</span>`).join('')}
            </div>
        ` : '';

        // Notes
        const notesHtml = venue.notes ? `
            <div class="notes ${venue.notesType || ''}">${venue.notes}</div>
        ` : '';

        // Details
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

        // Fullscreen Image Event
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
    searchInput.addEventListener('input', filterVenues);

    // Location Filter Toggle
    const filterToggle = document.getElementById('filterToggle');
    filterToggle.addEventListener('click', () => {
        const checkboxes = document.getElementById('locCheckboxes');
        checkboxes.classList.toggle('hidden');
        const isHidden = checkboxes.classList.contains('hidden');
        filterToggle.textContent = isHidden ? '📍 فلتر المواقع ▶' : '📍 فلتر المواقع ▼';
        filterToggle.classList.toggle('active', !isHidden);
    });

    // Checkboxes
    const selectAll = document.getElementById('selectAllLocs');
    selectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.loc-checkbox:not(.select-all) input').forEach(cb => {
            cb.checked = e.target.checked;
        });
        saveLocationFilters();
        filterVenues();
    });

    document.querySelectorAll('.loc-checkbox:not(.select-all) input').forEach(cb => {
        cb.addEventListener('change', () => {
            const allDocs = document.querySelectorAll('.loc-checkbox:not(.select-all) input');
            const allChecked = Array.from(allDocs).every(c => c.checked);
            selectAll.checked = allChecked;
            saveLocationFilters();
            filterVenues();
        });
    });
}

// ============================================
// Filter Logic with Fuzzy Search
// ============================================
function filterVenues() {
    const rawQuery = searchInput.value.trim();
    const selectedLocs = Array.from(document.querySelectorAll('.loc-checkbox:not(.select-all) input:checked'))
        .map(cb => cb.value);

    let matchedVenues = venues;

    // Apply fuzzy search if query exists
    if (rawQuery.length >= 2) {
        const queryData = prepareSearchQuery(rawQuery);

        // Search with all versions of the query
        const searches = [
            queryData.original,
            queryData.normalized,
            queryData.arabic
        ].filter(q => q && q.length >= 2);

        const allResults = new Map();

        searches.forEach(query => {
            const results = fuse.search(query);
            results.forEach(r => {
                const existing = allResults.get(r.item.id);
                if (!existing || r.score < existing.score) {
                    allResults.set(r.item.id, r);
                }
            });
        });

        matchedVenues = Array.from(allResults.values())
            .sort((a, b) => a.score - b.score)
            .map(r => r.item);
    }

    // Apply location filter
    if (selectedLocs.length > 0 && selectedLocs.length < document.querySelectorAll('.loc-checkbox:not(.select-all) input').length) {
        matchedVenues = matchedVenues.filter(v => selectedLocs.includes(v.location));
    }

    // Render results
    renderVenues(matchedVenues);
    updateVenueCount(matchedVenues.length);
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
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalImages.length === 0) return;
        modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
        updateModalImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modalImages.length === 0) return;
        modalIndex = (modalIndex + 1) % modalImages.length;
        updateModalImage();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
}

function openModal(images, index, cardId) {
    if (!images || images.length === 0) return;
    modalImages = images;
    modalIndex = index || 0;
    currentModalCardId = cardId || null;
    updateModalImage();
    document.getElementById('imageModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function updateModalImage() {
    document.getElementById('modalImage').src = modalImages[modalIndex];
    document.getElementById('modalCurrent').textContent = modalIndex + 1;
    document.getElementById('modalTotal').textContent = modalImages.length;

    // Sync with outer carousel if cardId is known
    if (currentModalCardId) {
        syncCarouselWithModal(currentModalCardId, modalIndex);
    }
}

function syncCarouselWithModal(cardId, imageIndex) {
    const card = document.getElementById(`card-${cardId}`);
    if (!card) return;

    const slides = card.querySelectorAll('.slide');
    const counter = card.querySelector('.current');

    if (slides.length === 0) return;

    // Update active slide
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === imageIndex);
    });

    // Update counter
    if (counter) {
        counter.textContent = imageIndex + 1;
    }

    // Update carousel state
    carouselStates[cardId] = imageIndex;
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
    document.body.style.overflow = '';

    // Save carousel states when modal closes
    saveCarouselStates();
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
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            try {
                localStorage.setItem('campsdb_scroll_pos', window.scrollY.toString());
            } catch (e) { }
        }, 150);
    }, { passive: true });
}

function restoreScrollPosition() {
    // Temporarily disabled to debug mobile toolbar issue
    // try {
    //     const savedPos = localStorage.getItem('campsdb_scroll_pos');
    //     if (savedPos) {
    //         setTimeout(() => {
    //             window.scrollTo(0, parseInt(savedPos, 10));
    //         }, 100);
    //     }
    // } catch (e) { }
}

// ============================================
// Carousel State Persistence
// ============================================
function saveCarouselStates() {
    try {
        localStorage.setItem('campsdb_carousel_states', JSON.stringify(carouselStates));
    } catch (e) { }
}

function restoreCarouselStates() {
    try {
        const saved = localStorage.getItem('campsdb_carousel_states');
        if (saved) {
            const states = JSON.parse(saved);
            Object.assign(carouselStates, states);
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

    // Initialize from saved state or 0
    if (carouselStates[cardId] === undefined) {
        carouselStates[cardId] = 0;
    }

    function updateSlide(newIndex) {
        slides[carouselStates[cardId]].classList.remove('active');
        carouselStates[cardId] = (newIndex + totalSlides) % totalSlides;
        slides[carouselStates[cardId]].classList.add('active');
        counter.textContent = carouselStates[cardId] + 1;

        // Trigger intelligent preloading for adjacent images
        loadImageIntelligently(cardId, images, carouselStates[cardId]);

        // Save state on every change
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

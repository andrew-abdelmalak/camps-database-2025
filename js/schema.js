// =============================================================================
// SCHEMA LOOKUP TABLES
// Used by app.js to display normalized data with proper icons and text
// =============================================================================

// Status codes for venue qualification
const STATUS_CODES = {
    // Positive
    "contacted": { icon: "✅", text: "تم التواصل" },

    // Negative - Venue issues
    "no_camping": { icon: "❌", text: "مفيش تخييم" },
    "no_camp_ground": { icon: "❌", text: "مفيش أرض تخييم" },
    "ground_unsuitable": { icon: "❌", text: "أرض لا تصلح" },
    "small_space": { icon: "❌", text: "مساحة صغيرة" },
    "no_venue": { icon: "❌", text: "مفيش بيت" },
    "not_accepting_scouts": { icon: "❌", text: "مش بيستقبل كشافة" },

    // Negative - Contact issues
    "no_response": { icon: "📵", text: "مش بيرد" },
    "unavailable": { icon: "📵", text: "غير متاح" },

    // Pending
    "under_construction": { icon: "🚧", text: "تحت الإنشاء" }
};

// Contact attempt outcomes
const CONTACT_OUTCOMES = {
    "answered": { icon: "✅", text: "رد" },
    "no_answer": { icon: "📵", text: "مردش" },
    "whatsapp_sent": { icon: "💬", text: "واتساب" },
    "callback_requested": { icon: "🔄", text: "هيرد" }
};

// Amenity display info (icon and Arabic name)
const AMENITY_DISPLAY = {
    "campground": { icon: "🏕️", name: "أرض معسكر" },
    "rooms": { icon: "🛏️", name: "غرف" },
    "kitchen": { icon: "🍳", name: "مطبخ" },
    "bathrooms": { icon: "🚿", name: "حمامات" },
    "church": { icon: "⛪", name: "كنيسة" },
    "halls": { icon: "🏛️", name: "قاعات" },
    "pergolas": { icon: "⛱️", name: "برجولات" },
    "pools": { icon: "🏊", name: "حمام سباحة" },
    "fields": { icon: "⚽", name: "ملاعب" },
    "ac": { icon: "❄️", name: "تكييف" },
    "cooler": { icon: "💧", name: "كولدير" },
    "playground": { icon: "🧸", name: "منطقة ألعاب" },
    "canteen": { icon: "🍴", name: "كانتين" },
    "sea": { icon: "🌊", name: "على البحر" }
};

// Link type display
const LINK_TYPES = {
    "google_maps": { icon: "🗺️", text: "خريطة" },
    "facebook": { icon: "📘", text: "Facebook" },
    "instagram": { icon: "📷", text: "Instagram" },
    "coptic_guide": { icon: "⛪", text: "Coptic Guide" },
    "website": { icon: "🔗", text: "الموقع" },
    "video": { icon: "📹", text: "فيديو" }
};

// What can be included in a price
const PRICE_INCLUDES = {
    "meals": "وجبات",
    "kitchen": "مطبخ",
    "gas": "غاز",
    "pool_2h": "بيسين ساعتين",
    "pool_3h": "بيسين 3 ساعات",
    "field_2h": "ملعب ساعتين",
    "hall_3h": "قاعة 3 ساعات",
    "ac": "تكييف",
    "breakfast": "فطار",
    "lunch": "غدا",
    "dinner": "عشا"
};

// Camp weekends for availability
const CAMP_WEEKENDS = [
    { date: "2026-07-02", label: "2-4 يوليو" },
    { date: "2026-07-09", label: "9-11 يوليو" },
    { date: "2026-07-16", label: "16-18 يوليو" },
    { date: "2026-07-23", label: "23-25 يوليو" },
    { date: "2026-07-30", label: "30 يوليو - 1 أغسطس" },
    { date: "2026-08-06", label: "6-8 أغسطس" }
];

// Valid locations for validation
const VALID_LOCATIONS = [
    "العبور", "الشروق", "طريق السويس", "المقطم",
    "الإسماعيلية", "مدينة السادات", "السخنة",
    "وادي النطرون", "فايد", "الريف الأوروبي",
    "بورفؤاد", "أبو تلات", "راس سدر",
    "كينج مريوط", "سيدي كرير", "العلمين",
    "عرابي", "السويس (تبع الرحاب)", "الخطاطبة",
    "بنها", "طريق مصر اسكندرية الصحراوي",
    "مرسي مطروح", "الزعفرانة", "أنشاص"
];

// Helper function to get status display text
function getStatusDisplay(statusCode) {
    if (!statusCode) return null;
    const status = STATUS_CODES[statusCode];
    return status ? `${status.icon} ${status.text}` : null;
}

// Helper function to format amenity with count
function formatAmenity(key, count) {
    if (count === 0) return null;
    const amenity = AMENITY_DISPLAY[key];
    if (!amenity) return null;

    // 1 = just show name, 2+ = show count
    if (count === 1) {
        return `${amenity.icon} ${amenity.name}`;
    } else {
        return `${amenity.icon} ${count} ${amenity.name}`;
    }
}

// Helper function to format price
function formatPrice(priceObj, type) {
    if (!priceObj) return null;

    let text = '';
    if (priceObj.min && priceObj.max) {
        text = `${priceObj.min}-${priceObj.max}ج`;
    } else if (priceObj.amount) {
        text = `${priceObj.amount}ج`;
    }

    if (priceObj.period) {
        const periods = { night: '/ليلة', day: '/يوم', hour: '/ساعة' };
        text += periods[priceObj.period] || '';
    }

    if (priceObj.includes && priceObj.includes.length > 0) {
        const includesText = priceObj.includes.map(i => PRICE_INCLUDES[i] || i).join(' + ');
        text += ` شامل ${includesText}`;
    }

    return text;
}

// Export for use in app.js
window.SCHEMA = {
    STATUS_CODES,
    CONTACT_OUTCOMES,
    AMENITY_DISPLAY,
    LINK_TYPES,
    PRICE_INCLUDES,
    CAMP_WEEKENDS,
    VALID_LOCATIONS,
    getStatusDisplay,
    formatAmenity,
    formatPrice
};

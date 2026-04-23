// Display configuration for status codes, amenities, links, and pricing
// Fixes Issue #8 (duplicate amenity icons), Issue #10 (duplicate pricing periods), Issue #12 (status codes)

// Status codes for venue qualification
export const STATUS_DISPLAY: Record<string, { icon: string; text: string; category: "positive" | "negative" | "pending" }> = {
    // Positive
    "contacted": { icon: "✅", text: "تم التواصل", category: "positive" },

    // Negative - Venue issues
    "no_camping": { icon: "❌", text: "مفيش تخييم", category: "negative" },
    "no_camp_ground": { icon: "❌", text: "مفيش أرض تخييم", category: "negative" },
    "ground_unsuitable": { icon: "❌", text: "أرض لا تصلح", category: "negative" },
    "small_space": { icon: "❌", text: "مساحة صغيرة", category: "negative" },
    "no_venue": { icon: "❌", text: "مفيش بيت", category: "negative" },
    "not_accepting_scouts": { icon: "❌", text: "مش بيستقبل كشافة", category: "negative" },

    // Negative - Contact issues
    "no_response": { icon: "📵", text: "مش بيرد", category: "negative" },
    "unavailable": { icon: "📵", text: "غير متاح", category: "negative" },

    // Pending
    "under_construction": { icon: "🚧", text: "تحت الإنشاء", category: "pending" },
};

// Contact attempt outcomes
export const CONTACT_OUTCOMES: Record<string, { icon: string; text: string }> = {
    "answered": { icon: "✅", text: "رد" },
    "no_answer": { icon: "📵", text: "مردش" },
    "whatsapp_sent": { icon: "💬", text: "واتساب" },
    "callback_requested": { icon: "🔄", text: "هيرد" },
};

// Amenity display info - Single source of truth
export const AMENITY_DISPLAY: Record<string, { icon: string; name: string }> = {
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
    "sea": { icon: "🌊", name: "على البحر" },
};

// Link type display
export const LINK_DISPLAY: Record<string, { icon: string; text: string }> = {
    "google_maps": { icon: "🗺️", text: "خريطة" },
    "facebook": { icon: "📘", text: "Facebook" },
    "instagram": { icon: "📷", text: "Instagram" },
    "coptic_guide": { icon: "⛪", text: "Coptic Guide" },
    "website": { icon: "🔗", text: "الموقع" },
    "video": { icon: "📹", text: "فيديو" },
};

// Price type labels - Arabic names for price categories
export const PRICE_TYPES: Record<string, string> = {
    "camping": "تخييم",
    "kitchen": "مطبخ",
    "rooms": "غرف",
    "dayUse": "يوم واحد",
    "day_use": "يوم واحد",
    "full_board": "إقامة كاملة",
};

// Capacity type labels - Arabic names for capacity categories
export const CAPACITY_TYPES: Record<string, { label: string; unit: string }> = {
    "camping": { label: "تخييم", unit: "فرد" },
    "beds": { label: "مبيت", unit: "سرير" },
};

// Price period labels - Single source of truth
export const PRICE_PERIODS: Record<string, string> = {
    "night": "/ليلة",
    "day": "/يوم",
    "hour": "/ساعة",
};

// What can be included in a price
export const PRICE_INCLUDES: Record<string, string> = {
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
    "dinner": "عشا",
    "full_board": "إقامة كاملة",
    "pool": "بيسين",
};

// Helper functions
export const getStatusDisplay = (statusCode: string | null) => {
    if (!statusCode) return null;
    const status = STATUS_DISPLAY[statusCode];
    return status ? `${status.icon} ${status.text}` : null;
};

export const formatAmenity = (key: string, count: number): string | null => {
    if (count === 0) return null;
    const amenity = AMENITY_DISPLAY[key];
    if (!amenity) return null;

    return count > 1
        ? `${amenity.icon} ${count} ${amenity.name}`
        : `${amenity.icon} ${amenity.name}`;
};

export const formatPrice = (amount: number | undefined, min: number | undefined, max: number | undefined, period?: string, includes?: string[]): string => {
    let text = '';

    if (min !== undefined && max !== undefined) {
        text = `${min}-${max}ج`;
    } else if (amount !== undefined) {
        text = `${amount}ج`;
    } else {
        return '';
    }

    if (period && PRICE_PERIODS[period]) {
        text += PRICE_PERIODS[period];
    }

    if (includes && includes.length > 0) {
        const includesText = includes.map(i => PRICE_INCLUDES[i] || i).join(' + ');
        text += ` شامل ${includesText}`;
    }

    return text;
};

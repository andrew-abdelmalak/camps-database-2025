// Location configuration with colors, aliases, and sort order
// Fixes Issue #4 (Location-CSS mappings), Issue #5 (VALID_LOCATIONS), Issue #6 (Arabizi mappings)

export interface LocationConfig {
    nameAr: string;
    nameEn: string;
    aliases: string[];  // For Arabizi/English search
    color: {
        from: string;
        to: string;
    };
    sortOrder: number;  // Base sort order for location grouping
}

export const locationsConfig: Record<string, LocationConfig> = {
    "طريق السويس": {
        nameAr: "طريق السويس",
        nameEn: "Suez Road",
        aliases: ["suez road", "suez", "tareek el suez"],
        color: { from: "#f472b6", to: "#fb7185" },
        sortOrder: 1,
    },
    "الشروق": {
        nameAr: "الشروق",
        nameEn: "El Shorouk",
        aliases: ["shorouk", "shorok", "shrouk", "el shorouk", "alshorouk"],
        color: { from: "#f97316", to: "#facc15" },
        sortOrder: 2,
    },
    "العبور": {
        nameAr: "العبور",
        nameEn: "El Obour",
        aliases: ["obour", "obor", "3obor", "el obour", "alobour"],
        color: { from: "#667eea", to: "#764ba2" },
        sortOrder: 3,
    },
    "المقطم": {
        nameAr: "المقطم",
        nameEn: "Mokattam",
        aliases: ["mokattam", "mo2attam", "muqattam", "mokatam"],
        color: { from: "#8b5cf6", to: "#a855f7" },
        sortOrder: 4,
    },
    "الإسماعيلية": {
        nameAr: "الإسماعيلية",
        nameEn: "Ismailia",
        aliases: ["ismailia", "ismailya", "isma3ilia", "el ismailia"],
        color: { from: "#ec4899", to: "#f43f5e" },
        sortOrder: 5,
    },
    "مدينة السادات": {
        nameAr: "مدينة السادات",
        nameEn: "Sadat City",
        aliases: ["sadat", "sadat city", "madinat el sadat"],
        color: { from: "#a78bfa", to: "#f472b6" },
        sortOrder: 6,
    },
    "السخنة": {
        nameAr: "السخنة",
        nameEn: "Ain Sokhna",
        aliases: ["sokhna", "ain sokhna", "sakhneh", "el sokhna"],
        color: { from: "#06b6d4", to: "#22d3ee" },
        sortOrder: 7,
    },
    "وادي النطرون": {
        nameAr: "وادي النطرون",
        nameEn: "Wadi Natrun",
        aliases: ["natroun", "natrun", "wadi", "wadi el natroun"],
        color: { from: "#ec4899", to: "#f43f5e" },
        sortOrder: 8,
    },
    "فايد": {
        nameAr: "فايد",
        nameEn: "Fayed",
        aliases: ["fayed", "fayid", "fayed"],
        color: { from: "#34d399", to: "#06b6d4" },
        sortOrder: 9,
    },
    "الريف الأوروبي": {
        nameAr: "الريف الأوروبي",
        nameEn: "European Countryside",
        aliases: ["european", "rif", "el rif", "rif el orobi"],
        color: { from: "#10b981", to: "#34d399" },
        sortOrder: 10,
    },
    "بورفؤاد": {
        nameAr: "بورفؤاد",
        nameEn: "Port Fouad",
        aliases: ["port fouad", "borfouad", "bor fouad"],
        color: { from: "#3b82f6", to: "#60a5fa" },
        sortOrder: 11,
    },
    "أبو تلات": {
        nameAr: "أبو تلات",
        nameEn: "Abu Talat",
        aliases: ["abu talat", "abu tlat", "abo talat"],
        color: { from: "#22d3ee", to: "#3b82f6" },
        sortOrder: 12,
    },
    "راس سدر": {
        nameAr: "راس سدر",
        nameEn: "Ras Sedr",
        aliases: ["ras sidr", "ras sedr", "ras sudr"],
        color: { from: "#f59e0b", to: "#fbbf24" },
        sortOrder: 13,
    },
    "كينج مريوط": {
        nameAr: "كينج مريوط",
        nameEn: "King Mariout",
        aliases: ["king mariut", "king maryut", "king mariout"],
        color: { from: "#84cc16", to: "#a3e635" },
        sortOrder: 14,
    },
    "سيدي كرير": {
        nameAr: "سيدي كرير",
        nameEn: "Sidi Krir",
        aliases: ["sidi krir", "sidi kreir", "sedy krir"],
        color: { from: "#0ea5e9", to: "#38bdf8" },
        sortOrder: 15,
    },
    "العلمين": {
        nameAr: "العلمين",
        nameEn: "El Alamein",
        aliases: ["alamein", "el alamein", "alamain"],
        color: { from: "#14b8a6", to: "#2dd4bf" },
        sortOrder: 16,
    },
    "عرابي": {
        nameAr: "عرابي",
        nameEn: "Arabi",
        aliases: ["3arabi", "arabi", "araby", "orabi"],
        color: { from: "#f97316", to: "#fb923c" },
        sortOrder: 17,
    },
    "السويس (تبع الرحاب)": {
        nameAr: "السويس (تبع الرحاب)",
        nameEn: "Suez (Rehab)",
        aliases: ["suez rehab", "el suez", "rehab suez"],
        color: { from: "#f472b6", to: "#fb7185" },
        sortOrder: 18,
    },
    "الخطاطبة": {
        nameAr: "الخطاطبة",
        nameEn: "El Khatatba",
        aliases: ["khatatba", "khattatba", "el khatatba"],
        color: { from: "#78716c", to: "#a8a29e" },
        sortOrder: 19,
    },
    "بنها": {
        nameAr: "بنها",
        nameEn: "Benha",
        aliases: ["benha", "banha"],
        color: { from: "#64748b", to: "#94a3b8" },
        sortOrder: 20,
    },
    "طريق مصر اسكندرية الصحراوي": {
        nameAr: "طريق مصر اسكندرية الصحراوي",
        nameEn: "Cairo-Alex Desert Road",
        aliases: ["cairo alex", "desert road", "sahrawi"],
        color: { from: "#fbbf24", to: "#fcd34d" },
        sortOrder: 21,
    },
    "مرسي مطروح": {
        nameAr: "مرسي مطروح",
        nameEn: "Marsa Matrouh",
        aliases: ["marsa matrouh", "matrouh", "marsa"],
        color: { from: "#0284c7", to: "#0ea5e9" },
        sortOrder: 22,
    },
    "الزعفرانة": {
        nameAr: "الزعفرانة",
        nameEn: "Zafarana",
        aliases: ["zafarana", "za3farana"],
        color: { from: "#dc2626", to: "#ef4444" },
        sortOrder: 23,
    },
    "أنشاص": {
        nameAr: "أنشاص",
        nameEn: "Anshas",
        aliases: ["anshas", "inshas"],
        color: { from: "#65a30d", to: "#84cc16" },
        sortOrder: 24,
    },
};

// Default color for unknown locations
export const defaultLocationColor = { from: "#94a3b8", to: "#cbd5e1" };

// Get color for any location (with fallback)
export const getLocationColor = (location: string) => {
    return locationsConfig[location]?.color ?? defaultLocationColor;
};

// Get CSS gradient string
export const getLocationGradient = (location: string) => {
    const color = getLocationColor(location);
    return `linear-gradient(135deg, ${color.from}, ${color.to})`;
};

// Derive valid locations dynamically from config (Issue #5 fix)
export const getValidLocations = (): string[] => {
    return Object.keys(locationsConfig);
};

// Get all aliases for search (Issue #6 fix)
export const getAllLocationAliases = (): Record<string, string> => {
    const aliases: Record<string, string> = {};
    for (const [location, config] of Object.entries(locationsConfig)) {
        for (const alias of config.aliases) {
            aliases[alias.toLowerCase()] = location;
        }
    }
    return aliases;
};

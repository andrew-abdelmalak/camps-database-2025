// Site-wide configuration
// Fixes Issue #7 (Hardcoded HTML content) and Issue #16 (Footer year mismatch)

export const siteConfig = {
    // Organization info
    churchName: "كنيسة العذراء ومارجرجس بمدينتي",
    committeeName: "لجنة معسكرات",
    year: 2025,

    // Home location for distance-based sorting reference
    homeLocation: {
        name: "مدينتي",
        // Can add lat/lng later for actual distance calculations
    },

    // UI text
    pageTitle: "دليل بيوت المعسكرات",
    mainTitle: "🏕️ بيوت المعسكرات",
    sortingDescription: "مرتب حسب القرب من مدينتي",
    noResultsText: "😕 لا توجد نتائج",
    searchPlaceholder: "🔍 بحث بالعربي أو English أو Franco...",
} as const;

export type SiteConfig = typeof siteConfig;

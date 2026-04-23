// LocalStorage key constants
// Fixes Issue #14 (localStorage keys scattered)

export const STORAGE_KEYS = {
    favorites: "campsdb_favorites",
    scrollPosition: "campsdb_scroll_pos",
    carouselStates: "campsdb_carousel_states",
    locationFilters: "campsdb_loc_filters",
    activeTab: "campsdb_active_tab",
    lastSearch: "campsdb_last_search",
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

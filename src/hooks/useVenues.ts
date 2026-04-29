import { useMemo, useState, useCallback } from "react";
import type { Venue, TabType, SortBy } from "@/types";
import { venues } from "@/data/venues";

const MIN_SEARCH_LENGTH = 2;

const getTabForVenue = (venue: Venue): TabType => (
    venue.isFavorite ? "favorites" : "rest"
);

const matchesPublishedSearch = (venue: Venue, query: string): boolean => (
    Boolean(venue.name && venue.name.includes(query))
);

export function useVenues() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("favorites");
    const sortBy: SortBy = "sortOrder";

    // Stage 1 parity keeps the published custom order fixed.
    const sortedVenues = useMemo(() => {
        const list = [...venues];
        return list.sort((a, b) => a.sortOrder - b.sortOrder);
    }, []);

    // Filter by tab
    const tabFilteredVenues = useMemo(() => {
        if (activeTab === "favorites") {
            return sortedVenues.filter((v) => v.isFavorite);
        }
        return sortedVenues.filter((v) => !v.isFavorite);
    }, [sortedVenues, activeTab]);

    // Keep Stage 1 parity with the published app: simple venue-name search.
    const filteredVenues = useMemo(() => {
        const query = searchQuery.trim();

        if (query.length < MIN_SEARCH_LENGTH) {
            return tabFilteredVenues;
        }

        return tabFilteredVenues.filter((v) => matchesPublishedSearch(v, query));
    }, [tabFilteredVenues, searchQuery]);

    // Tab counts (based on search if active)
    const counts = useMemo(() => {
        const query = searchQuery.trim();
        const baseList = query.length >= MIN_SEARCH_LENGTH
            ? sortedVenues.filter((v) => matchesPublishedSearch(v, query))
            : sortedVenues;

        return {
            favorites: baseList.filter((v) => v.isFavorite).length,
            rest: baseList.filter((v) => !v.isFavorite).length,
        };
    }, [sortedVenues, searchQuery]);

    // Auto-switch tabs when the current tab has no result but another tab does.
    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);

        const trimmedQuery = query.trim();
        if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
            const currentTabMatches = sortedVenues.filter(
                (v) => getTabForVenue(v) === activeTab && matchesPublishedSearch(v, trimmedQuery)
            );
            const allMatches = sortedVenues.filter((v) => matchesPublishedSearch(v, trimmedQuery));

            if (currentTabMatches.length === 0 && allMatches.length > 0) {
                const targetTab = getTabForVenue(allMatches[0]);
                if (targetTab !== activeTab) {
                    setActiveTab(targetTab);
                }
            }
        }
    }, [activeTab, sortedVenues]);

    return {
        venues: filteredVenues,
        allVenues: venues,
        counts,
        searchQuery,
        setSearchQuery: handleSearchChange,
        activeTab,
        setActiveTab,
        sortBy,
    };
}

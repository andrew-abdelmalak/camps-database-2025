// Camp weekends configuration - Single source of truth
// Fixes Issue #3 (Year 2026 hardcoded 300+ times)

export interface CampWeekend {
    id: string;
    startDate: string;  // ISO format YYYY-MM-DD
    endDate: string;
    label: string;      // Display label in Arabic
}

// To change years, only edit this array
export const campWeekends: CampWeekend[] = [
    { id: "w1", startDate: "2026-07-02", endDate: "2026-07-04", label: "2-4 يوليو" },
    { id: "w2", startDate: "2026-07-09", endDate: "2026-07-11", label: "9-11 يوليو" },
    { id: "w3", startDate: "2026-07-16", endDate: "2026-07-18", label: "16-18 يوليو" },
    { id: "w4", startDate: "2026-07-23", endDate: "2026-07-25", label: "23-25 يوليو" },
    { id: "w5", startDate: "2026-07-30", endDate: "2026-08-01", label: "30 يوليو - 1 أغسطس" },
    { id: "w6", startDate: "2026-08-06", endDate: "2026-08-08", label: "6-8 أغسطس" },
];

// Derive the camp year from the first weekend
export const getCampYear = (): number => {
    const firstWeekend = campWeekends[0];
    return new Date(firstWeekend.startDate).getFullYear();
};

// Get all weekend IDs for availability tracking
export const getCampWeekendIds = (): string[] => {
    return campWeekends.map(w => w.id);
};

// Get weekend by ID
export const getCampWeekendById = (id: string): CampWeekend | undefined => {
    return campWeekends.find(w => w.id === id);
};

// Get weekend by date
export const getCampWeekendByDate = (date: string): CampWeekend | undefined => {
    return campWeekends.find(w => w.startDate === date);
};

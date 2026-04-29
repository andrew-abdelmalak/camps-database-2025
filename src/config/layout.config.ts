// Layout configuration
// Fixes Issue #13 (column breakpoints duplicated)

export const GRID_BREAKPOINTS = {
    sm: 768,    // 2 columns
    lg: 1200,   // 3 columns
    xl: 1600,   // 4 columns
} as const;

export const getColumnCount = (width: number): number => {
    if (width >= GRID_BREAKPOINTS.xl) return 4;
    if (width >= GRID_BREAKPOINTS.lg) return 3;
    if (width >= GRID_BREAKPOINTS.sm) return 2;
    return 1;
};

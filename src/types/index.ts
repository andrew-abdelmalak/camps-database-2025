// TypeScript interfaces for the camps database
// Fixes Issue #9 (string-based sequential IDs) by using prefixed IDs

export interface Phone {
    number: string;
    name: string | null;
}

export type LinkType = "google_maps" | "facebook" | "instagram" | "coptic_guide" | "website" | "video";

export interface Link {
    url: string;
    type: LinkType;
}

export interface PriceInfo {
    amount?: number;
    min?: number;
    max?: number;
    period: "night" | "day" | "hour";
    includes: string[];
}

export interface Pricing {
    camping?: PriceInfo;
    rooms?: PriceInfo;
    kitchen?: PriceInfo;
    meals?: PriceInfo;
    dayUse?: Omit<PriceInfo, "period"> & { period?: PriceInfo["period"] };
}

export interface Capacity {
    camping: number | null;
    beds: number | null;
}

export interface Amenities {
    campground?: number;
    rooms?: number;
    kitchen?: number;
    bathrooms?: number;
    church?: number;
    halls?: number;
    pergolas?: number;
    pools?: number;
    fields?: number;
    ac?: number;
    cooler?: number;
    playground?: number;
    canteen?: number;
    sea?: number;
}

export interface ContactRecord {
    date: string;
    outcome: "answered" | "no_answer" | "whatsapp_sent" | "callback_requested";
    notes: string | null;
}

export type StatusCode =
    | "contacted"
    | "no_camping"
    | "no_camp_ground"
    | "ground_unsuitable"
    | "small_space"
    | "no_venue"
    | "not_accepting_scouts"
    | "no_response"
    | "unavailable"
    | "under_construction"
    | null;

// Availability is now a sparse object - only confirmed bookings are stored
// Empty = unknown, true = available, false = booked
export type Availability = Record<string, boolean | null>;

export interface Venue {
    id: string;                    // Prefixed ID like "venue-1"
    name: string;
    location: string;
    sortOrder: number;             // For custom sorting (Issue #2 fix)
    isFavorite: boolean;           // Data-driven favorites (Issue #1 fix)
    statusCode: StatusCode;
    phones: Phone[];
    links: Link[];
    lastContact: ContactRecord | null;
    pricing: Pricing | null;
    capacity: Capacity | null;
    amenities: Amenities;
    notes: string | null;
    notesType: "warning" | "info" | "success" | "";
    details: string | null;
    images: string[];
    availability: Availability;    // Sparse - only actual bookings (Issue #3 fix)
}

// Matches the published app tabs: shortlisted venues and everything else.
export type TabType = "favorites" | "rest";

// Sort options
export type SortBy = "sortOrder" | "name" | "location" | "price";

// Filter state
export interface FilterState {
    search: string;
    tab: TabType;
    sortBy: SortBy;
    locations: string[];
}

// Carousel state for persistence
export interface CarouselState {
    [venueId: string]: number;
}

import rawVenues from "@/data/venues.json";
import type {
    Amenities,
    Availability,
    Capacity,
    ContactRecord,
    Link,
    Phone,
    PriceInfo,
    Pricing,
    StatusCode,
    Venue,
} from "@/types";

const LINK_TYPES = ["google_maps", "facebook", "instagram", "coptic_guide", "website", "video"] as const;
const CONTACT_OUTCOMES = ["answered", "no_answer", "whatsapp_sent", "callback_requested"] as const;
const STATUS_CODES = [
    "contacted",
    "no_camping",
    "no_camp_ground",
    "ground_unsuitable",
    "small_space",
    "no_venue",
    "not_accepting_scouts",
    "no_response",
    "unavailable",
    "under_construction",
] as const;
const NOTES_TYPES = ["warning", "info", "success", ""] as const;
const PRICE_PERIODS = ["night", "day", "hour"] as const;
const PRICE_KEYS = ["camping", "rooms", "kitchen", "meals", "dayUse"] as const;
const AMENITY_KEYS = [
    "campground",
    "rooms",
    "kitchen",
    "bathrooms",
    "church",
    "halls",
    "pergolas",
    "pools",
    "fields",
    "ac",
    "cooler",
    "playground",
    "canteen",
    "sea",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeVenueRecord(value: unknown): unknown {
    if (!isRecord(value)) {
        return value;
    }

    return {
        ...value,
        location: typeof value.location === "string" ? value.location : "",
        statusCode: value.statusCode ?? null,
    };
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isPhone(value: unknown): value is Phone {
    return (
        isRecord(value) &&
        typeof value.number === "string" &&
        (typeof value.name === "string" || value.name === null)
    );
}

function isLink(value: unknown): value is Link {
    return (
        isRecord(value) &&
        typeof value.url === "string" &&
        typeof value.type === "string" &&
        LINK_TYPES.includes(value.type as (typeof LINK_TYPES)[number])
    );
}

function isPriceInfo(value: unknown, allowOptionalPeriod = false): value is PriceInfo {
    return (
        isRecord(value) &&
        (typeof value.amount === "number" || value.amount === undefined) &&
        (typeof value.min === "number" || value.min === undefined) &&
        (typeof value.max === "number" || value.max === undefined) &&
        (allowOptionalPeriod
            ? value.period === undefined ||
              (typeof value.period === "string" &&
                  PRICE_PERIODS.includes(value.period as (typeof PRICE_PERIODS)[number]))
            : typeof value.period === "string" &&
              PRICE_PERIODS.includes(value.period as (typeof PRICE_PERIODS)[number])) &&
        isStringArray(value.includes)
    );
}

function isPricing(value: unknown): value is Pricing {
    if (value === null) return true;
    if (!isRecord(value)) return false;

    return Object.entries(value).every(([key, item]) => {
        if (!PRICE_KEYS.includes(key as (typeof PRICE_KEYS)[number])) {
            return false;
        }

        return key === "dayUse" ? isPriceInfo(item, true) : isPriceInfo(item);
    });
}

function isCapacity(value: unknown): value is Capacity {
    return (
        isRecord(value) &&
        (typeof value.camping === "number" || value.camping === null) &&
        (typeof value.beds === "number" || value.beds === null)
    );
}

function isAmenities(value: unknown): value is Amenities {
    if (!isRecord(value)) return false;

    return Object.entries(value).every(
        ([key, item]) =>
            AMENITY_KEYS.includes(key as (typeof AMENITY_KEYS)[number]) &&
            typeof item === "number",
    );
}

function isContactRecord(value: unknown): value is ContactRecord {
    return (
        isRecord(value) &&
        typeof value.date === "string" &&
        typeof value.outcome === "string" &&
        CONTACT_OUTCOMES.includes(value.outcome as (typeof CONTACT_OUTCOMES)[number]) &&
        (typeof value.notes === "string" || value.notes === null)
    );
}

function isAvailability(value: unknown): value is Availability {
    return (
        isRecord(value) &&
        Object.values(value).every((item) => typeof item === "boolean" || item === null)
    );
}

function isStatusCode(value: unknown): value is StatusCode {
    return (
        value === null ||
        (typeof value === "string" &&
            STATUS_CODES.includes(value as (typeof STATUS_CODES)[number]))
    );
}

function isVenue(value: unknown): value is Venue {
    return (
        isRecord(value) &&
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        typeof value.location === "string" &&
        typeof value.sortOrder === "number" &&
        typeof value.isFavorite === "boolean" &&
        isStatusCode(value.statusCode) &&
        Array.isArray(value.phones) &&
        value.phones.every(isPhone) &&
        Array.isArray(value.links) &&
        value.links.every(isLink) &&
        (value.lastContact === null || isContactRecord(value.lastContact)) &&
        isPricing(value.pricing) &&
        (value.capacity === null || isCapacity(value.capacity)) &&
        isAmenities(value.amenities) &&
        (typeof value.notes === "string" || value.notes === null) &&
        typeof value.notesType === "string" &&
        NOTES_TYPES.includes(value.notesType as (typeof NOTES_TYPES)[number]) &&
        (typeof value.details === "string" || value.details === null) &&
        isStringArray(value.images) &&
        isAvailability(value.availability)
    );
}

/**
 * Validate the static venue dataset at runtime so UI code never renders unchecked JSON.
 */
export function parseVenuesData(data: unknown): Venue[] {
    if (!Array.isArray(data)) {
        throw new Error("Venue dataset must be an array.");
    }

    const normalizedData = data.map(normalizeVenueRecord);
    const venues = normalizedData.filter(isVenue);
    if (venues.length !== normalizedData.length) {
        throw new Error("Venue dataset contains invalid records.");
    }

    return venues;
}

export const venues = parseVenuesData(rawVenues);

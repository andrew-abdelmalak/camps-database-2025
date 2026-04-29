import { memo, useMemo } from "react";
import type { Venue } from "@/types";
import { ImageCarousel } from "@/components/Media/ImageCarousel";
import { getLocationGradient } from "@/config/locations.config";
import {
    CAPACITY_TYPES,
    LINK_DISPLAY,
    PRICE_TYPES,
    formatAmenity,
    formatPrice,
} from "@/config/display.config";

interface VenueCardProps {
    venue: Venue;
    carouselIndex: number;
    onCarouselChange: (venueId: string, index: number) => void;
    onImageClick?: (images: string[], index: number, venueId: string) => void;
}

function PriceSection({ pricing }: { pricing: Venue["pricing"] }) {
    if (!pricing) return null;

    const badges = Object.entries(pricing).flatMap(([priceType, priceInfo]) => {
        if (!priceInfo) return [];

        const formattedPrice = formatPrice(
            priceInfo.amount,
            priceInfo.min,
            priceInfo.max,
            priceInfo.period,
            priceInfo.includes,
        );

        if (!formattedPrice) return [];

        const typeLabel = PRICE_TYPES[priceType] || "";
        const badge = typeLabel ? `${typeLabel}: ${formattedPrice}` : formattedPrice;
        return [{ key: `${priceType}-${badge}`, badge }];
    });

    if (badges.length === 0) return null;

    return (
        <div className="venue-row venue-row-price">
            <span className="venue-label">💰 السعر</span>
            <div className="price-items-wrapper">
                {badges.map(({ key, badge }) => (
                    <span key={key} className="price-badge">{badge}</span>
                ))}
            </div>
        </div>
    );
}

function CapacitySection({ capacity }: { capacity: Venue["capacity"] }) {
    if (!capacity) return null;

    const badges = Object.entries(capacity).flatMap(([capacityType, value]) => {
        if (value === null) return [];
        const typeInfo = CAPACITY_TYPES[capacityType];
        return typeInfo
            ? [{ key: `${capacityType}-${value}`, badge: `${typeInfo.label}: ~${value} ${typeInfo.unit}` }]
            : [];
    });

    if (badges.length === 0) return null;

    return (
        <div className="venue-row venue-row-capacity">
            <span className="venue-label">👥 السعة</span>
            <div className="capacity-badges">
                {badges.map(({ key, badge }) => (
                    <span key={key} className="capacity-badge">{badge}</span>
                ))}
            </div>
        </div>
    );
}

function AmenitiesSection({ amenities }: { amenities: Venue["amenities"] }) {
    const items = Object.entries(amenities).flatMap(([key, count]) => {
        const text = formatAmenity(key, count);
        return text ? [{ key: `${key}-${text}`, text }] : [];
    });

    if (items.length === 0) return null;

    return (
        <div className="amenities">
            {items.map(({ key, text }) => (
                <span key={key} className="amenity">{text}</span>
            ))}
        </div>
    );
}

export const VenueCard = memo(function VenueCard({
    venue,
    carouselIndex,
    onCarouselChange,
    onImageClick,
}: VenueCardProps) {
    const headerStyle = useMemo(
        () => ({ background: getLocationGradient(venue.location) }),
        [venue.location],
    );

    return (
        <div className="venue-card" id={`card-${venue.id}`}>
            <div className="card-header" style={headerStyle}>
                <h3 className="venue-name">{venue.name}</h3>
            </div>

            <div className="card-body">
                {venue.images.length > 0 && (
                    <ImageCarousel
                        images={venue.images}
                        venueId={venue.id}
                        currentIndex={carouselIndex}
                        onIndexChange={onCarouselChange}
                        onImageClick={onImageClick}
                    />
                )}

                <div className="venue-row">
                    <span className="venue-label">📍 الموقع</span>
                    <span className="venue-value">{venue.location}</span>
                </div>

                {venue.phones.length > 0 && (
                    <div className="venue-row venue-row-phones">
                        <span className="venue-label">📞 التليفون</span>
                        <div className="phone-items-wrapper">
                            {venue.phones.map((phone) => (
                                <a key={phone.number} href={`tel:${phone.number}`} className="phone-item">
                                    <span className="phone-number">{phone.number}</span>
                                    {phone.name && <span className="phone-contact">{phone.name}</span>}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {venue.links.length > 0 && (
                    <div className="venue-row venue-row-links">
                        <span className="venue-label">🔗 اللينكات</span>
                        <div className="links-items-wrapper">
                            {venue.links.map((link) => {
                                const linkInfo = LINK_DISPLAY[link.type] || { icon: "🔗", text: "رابط" };
                                return (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-item"
                                    >
                                        {linkInfo.icon} {linkInfo.text}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                <PriceSection pricing={venue.pricing} />
                <CapacitySection capacity={venue.capacity} />
                <AmenitiesSection amenities={venue.amenities} />

                {venue.notes && (
                    <div className={`notes ${venue.notesType || ""}`}>
                        {venue.notes}
                    </div>
                )}

                {venue.details && (
                    <div className="details">
                        {venue.details}
                    </div>
                )}
            </div>
        </div>
    );
});

VenueCard.displayName = "VenueCard";

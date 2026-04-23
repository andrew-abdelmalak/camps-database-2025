import type { Venue } from "@/types";
import { getLocationGradient } from "@/config/locations.config";
import { AMENITY_DISPLAY, LINK_DISPLAY, PRICE_PERIODS, PRICE_TYPES, CAPACITY_TYPES } from "@/config/display.config";
import { ImageCarousel } from "../Media/ImageCarousel";

interface VenueCardProps {
    venue: Venue;
    carouselIndex: number;
    onCarouselChange: (venueId: string, index: number) => void;
    onImageClick?: (images: string[], index: number, venueId: string) => void;
}

export function VenueCard({ venue, carouselIndex, onCarouselChange, onImageClick }: VenueCardProps) {
    const headerStyle = {
        background: getLocationGradient(venue.location),
    };

    // Format price badges
    const renderPriceBadges = () => {
        if (!venue.pricing) return null;

        const badges: string[] = [];
        for (const [priceType, priceInfo] of Object.entries(venue.pricing)) {
            if (!priceInfo) continue;

            // Get Arabic label for this price type
            const typeLabel = PRICE_TYPES[priceType] || '';

            let text = '';
            if (priceInfo.min !== undefined && priceInfo.max !== undefined) {
                text = `${priceInfo.min}-${priceInfo.max}ج`;
            } else if (priceInfo.amount !== undefined) {
                text = `${priceInfo.amount}ج`;
            }

            if (priceInfo.period && PRICE_PERIODS[priceInfo.period]) {
                text += PRICE_PERIODS[priceInfo.period];
            }

            if (priceInfo.includes && priceInfo.includes.length > 0) {
                text += ' شامل';
            }

            // Add label prefix if available
            if (typeLabel && text) {
                text = `${typeLabel}: ${text}`;
            }

            if (text) badges.push(text);
        }

        if (badges.length === 0) return null;

        return (
            <div className="venue-row venue-row-price">
                <span className="venue-label">💰 السعر</span>
                <div className="price-items-wrapper">
                    {badges.map((badge, i) => (
                        <span key={i} className="price-badge">{badge}</span>
                    ))}
                </div>
            </div>
        );
    };

    // Format capacity badges
    const renderCapacity = () => {
        if (!venue.capacity) return null;

        const badges: string[] = [];

        for (const [capacityType, value] of Object.entries(venue.capacity)) {
            if (!value) continue;
            const typeInfo = CAPACITY_TYPES[capacityType];
            if (typeInfo) {
                badges.push(`${typeInfo.label}: ~${value} ${typeInfo.unit}`);
            }
        }

        if (badges.length === 0) return null;

        return (
            <div className="venue-row venue-row-capacity">
                <span className="venue-label">👥 السعة</span>
                <div className="capacity-badges">
                    {badges.map((badge, i) => (
                        <span key={i} className="capacity-badge">{badge}</span>
                    ))}
                </div>
            </div>
        );
    };

    // Format amenities
    const renderAmenities = () => {
        const items: string[] = [];

        for (const [key, count] of Object.entries(venue.amenities)) {
            if (count === 0) continue;
            const display = AMENITY_DISPLAY[key];
            if (!display) continue;

            const text = count > 1
                ? `${display.icon} ${count} ${display.name}`
                : `${display.icon} ${display.name}`;
            items.push(text);
        }

        if (items.length === 0) return null;

        return (
            <div className="amenities">
                {items.map((item, i) => (
                    <span key={i} className="amenity">{item}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="venue-card" id={`card-${venue.id}`}>
            {/* Header with dynamic location color */}
            <div className="card-header" style={headerStyle}>
                <h3 className="venue-name">{venue.name}</h3>
            </div>

            <div className="card-body">
                {/* Image Carousel */}
                {venue.images.length > 0 && (
                    <ImageCarousel
                        images={venue.images}
                        venueId={venue.id}
                        currentIndex={carouselIndex}
                        onIndexChange={onCarouselChange}
                        onImageClick={onImageClick}
                    />
                )}

                {/* Location */}
                <div className="venue-row">
                    <span className="venue-label">📍 الموقع</span>
                    <span className="venue-value">{venue.location}</span>
                </div>

                {/* Phones */}
                {venue.phones.length > 0 && (
                    <div className="venue-row venue-row-phones">
                        <span className="venue-label">📞 التليفون</span>
                        <div className="phone-items-wrapper">
                            {venue.phones.map((phone, i) => (
                                <a key={i} href={`tel:${phone.number}`} className="phone-item">
                                    <span className="phone-number">{phone.number}</span>
                                    {phone.name && <span className="phone-contact">{phone.name}</span>}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Links */}
                {venue.links.length > 0 && (
                    <div className="venue-row venue-row-links">
                        <span className="venue-label">🔗 اللينكات</span>
                        <div className="links-items-wrapper">
                            {venue.links.map((link, i) => {
                                const linkInfo = LINK_DISPLAY[link.type] || { icon: "🔗", text: "رابط" };
                                return (
                                    <a
                                        key={i}
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

                {/* Price */}
                {renderPriceBadges()}

                {/* Capacity */}
                {renderCapacity()}

                {/* Amenities */}
                {renderAmenities()}

                {/* Notes */}
                {venue.notes && (
                    <div className={`notes ${venue.notesType || ''}`}>
                        {venue.notes}
                    </div>
                )}

                {/* Details */}
                {venue.details && (
                    <div className="details">
                        {venue.details}
                    </div>
                )}
            </div>
        </div>
    );
}

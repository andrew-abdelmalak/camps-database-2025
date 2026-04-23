import { useCallback, useMemo } from "react";
import { withBasePath } from "@/utils/assets";

interface ImageCarouselProps {
    images: string[];
    venueId: string;
    currentIndex: number;
    onIndexChange: (venueId: string, index: number) => void;
    onImageClick?: (images: string[], index: number, venueId: string) => void;
}

export function ImageCarousel({
    images,
    venueId,
    currentIndex,
    onIndexChange,
    onImageClick,
}: ImageCarouselProps) {
    const safeIndex = images.length === 0 ? 0 : currentIndex % images.length;

    const loadedImages = useMemo(() => {
        if (images.length === 0) return new Set<number>();
        return new Set([
            safeIndex,
            (safeIndex + 1) % images.length,
            (safeIndex - 1 + images.length) % images.length,
        ]);
    }, [images.length, safeIndex]);

    const goToPrev = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onIndexChange(venueId, (safeIndex - 1 + images.length) % images.length);
    }, [images.length, onIndexChange, safeIndex, venueId]);

    const goToNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onIndexChange(venueId, (safeIndex + 1) % images.length);
    }, [images.length, onIndexChange, safeIndex, venueId]);

    const handleImageClick = useCallback(() => {
        onImageClick?.(images, safeIndex, venueId);
    }, [images, onImageClick, safeIndex, venueId]);

    if (images.length === 0) return null;

    return (
        <div className="carousel" data-venue={venueId}>
            <div className="slides">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`slide ${idx === safeIndex ? "active" : ""}`}
                    >
                        {loadedImages.has(idx) ? (
                            <img
                                src={withBasePath(img)}
                                alt={`${venueId} image ${idx + 1}`}
                                onClick={handleImageClick}
                                loading="lazy"
                            />
                        ) : (
                            <div className="slide-placeholder" />
                        )}
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button className="nav-btn prev" onClick={goToPrev}>❮</button>
                    <button className="nav-btn next" onClick={goToNext}>❯</button>
                    <div className="counter">
                        <span>{safeIndex + 1}</span>/{images.length}
                    </div>
                </>
            )}
        </div>
    );
}

import { useMemo } from "react";
import type { Venue } from "@/types";
import { VenueCard } from "@/components/Venue/VenueCard";
import { useColumnCount } from "@/hooks/useColumnCount";

interface VenueGridProps {
    venues: Venue[];
    carouselStates: Record<string, number>;
    onCarouselChange: (venueId: string, index: number) => void;
    onImageClick?: (images: string[], index: number, venueId: string) => void;
}

export function VenueGrid({ venues, carouselStates, onCarouselChange, onImageClick }: VenueGridProps) {
    const columnCount = useColumnCount();

    // Distribute venues into columns (balanced masonry)
    const columns = useMemo(() => {
        const cols: Venue[][] = Array.from({ length: columnCount }, () => []);

        venues.forEach((venue, index) => {
            // First row: strict order for proper RTL sorting display
            if (index < columnCount) {
                cols[index].push(venue);
            } else {
                // After first row: add to shortest column
                let shortestIdx = 0;
                let shortestLen = cols[0].length;
                for (let i = 1; i < cols.length; i++) {
                    if (cols[i].length < shortestLen) {
                        shortestLen = cols[i].length;
                        shortestIdx = i;
                    }
                }
                cols[shortestIdx].push(venue);
            }
        });

        return cols;
    }, [venues, columnCount]);

    if (venues.length === 0) {
        return <div className="no-results show">😕 لا توجد نتائج</div>;
    }

    return (
        <div className="venue-grid">
            {columns.map((columnVenues, colIndex) => (
                <div key={colIndex} className="masonry-col">
                    {columnVenues.map((venue) => (
                        <VenueCard
                            key={venue.id}
                            venue={venue}
                            carouselIndex={carouselStates[venue.id] ?? 0}
                            onCarouselChange={onCarouselChange}
                            onImageClick={onImageClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

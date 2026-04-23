import { useState, useEffect } from "react";
import { getColumnCount, getSkeletonCount } from "@/config/layout.config";

interface SkeletonGridProps {
    expectedCount?: number;
}

export function SkeletonGrid({ expectedCount = 6 }: SkeletonGridProps) {
    const [columnCount, setColumnCount] = useState(() => getColumnCount(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            setColumnCount(getColumnCount(window.innerWidth));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const cardsPerColumn = getSkeletonCount(expectedCount, columnCount);

    return (
        <div className="venue-grid">
            {Array.from({ length: columnCount }).map((_, colIndex) => (
                <div key={colIndex} className="masonry-col">
                    {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
                        <div key={cardIndex} className="skeleton-card">
                            <div className="skeleton-header" />
                            <div className="skeleton skeleton-image" />
                            <div className="skeleton skeleton-line medium" />
                            <div className="skeleton skeleton-line short" />
                            <div className="skeleton-amenities">
                                <div className="skeleton skeleton-tag" />
                                <div className="skeleton skeleton-tag" />
                                <div className="skeleton skeleton-tag" />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

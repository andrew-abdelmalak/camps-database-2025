import { useEffect, useCallback } from "react";
import { withBasePath } from "@/utils/assets";

interface ImageModalProps {
    images: string[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}

export function ImageModal({
    images,
    currentIndex,
    isOpen,
    onClose,
    onNavigate
}: ImageModalProps) {

    const goToPrev = useCallback(() => {
        onNavigate((currentIndex - 1 + images.length) % images.length);
    }, [currentIndex, images.length, onNavigate]);

    const goToNext = useCallback(() => {
        onNavigate((currentIndex + 1) % images.length);
    }, [currentIndex, images.length, onNavigate]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === "ArrowRight") goToNext();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose, goToPrev, goToNext]);

    if (!isOpen || images.length === 0) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal show" onClick={handleBackdropClick} dir="ltr">
            <button className="modal-close" onClick={onClose} type="button" aria-label="Close image viewer">
                &times;
            </button>

            {images.length > 1 && (
                <button className="modal-nav modal-prev" onClick={goToPrev} type="button" aria-label="Previous image">❮</button>
            )}

            <img src={withBasePath(images[currentIndex])} alt={`Image ${currentIndex + 1}`} />

            {images.length > 1 && (
                <button className="modal-nav modal-next" onClick={goToNext} type="button" aria-label="Next image">❯</button>
            )}

            <div className="modal-counter">
                <span>{currentIndex + 1}</span> / <span>{images.length}</span>
            </div>
        </div>
    );
}

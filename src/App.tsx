import { useState, useCallback, useEffect } from "react";
import "@/styles/globals.css";

import { Header, Footer } from "@/components/Layout";
import { FilterTabs } from "@/components/Search/FilterTabs";
import { VenueGrid } from "@/components/Venue/VenueGrid";
import { ImageModal } from "@/components/Media/ImageModal";
import { useVenues } from "@/hooks/useVenues";
import { STORAGE_KEYS } from "@/config/storage-keys";
import type { CarouselState } from "@/types";

const RESTORE_TTL_MS = 30 * 60 * 1000;

function isCarouselState(value: unknown): value is CarouselState {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((item) => typeof item === "number")
  );
}

function isStoredState(
  value: unknown,
): value is { timestamp: number; states?: CarouselState; y?: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { timestamp?: unknown }).timestamp === "number"
  );
}

function readSavedCarouselStates(): CarouselState {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.carouselStates);
    if (!saved) return {};

    const data = JSON.parse(saved) as unknown;
    if (!isStoredState(data) || Date.now() - data.timestamp > RESTORE_TTL_MS) return {};

    return isCarouselState(data.states) ? data.states : {};
  } catch {
    return {};
  }
}

function writeCarouselStates(states: CarouselState) {
  try {
    localStorage.setItem(STORAGE_KEYS.carouselStates, JSON.stringify({
      states,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore private browsing/storage quota failures.
  }
}

function App() {
  const {
    venues,
    counts,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
  } = useVenues();

  // Modal state
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVenueId, setModalVenueId] = useState<string | null>(null);
  const [carouselStates, setCarouselStates] = useState<CarouselState>(readSavedCarouselStates);

  const handleCarouselChange = useCallback((venueId: string, index: number) => {
    setCarouselStates((previous) => {
      const next = { ...previous, [venueId]: index };
      writeCarouselStates(next);
      return next;
    });
  }, []);

  const handleImageClick = useCallback((images: string[], index: number, venueId: string) => {
    setModalImages(images);
    setModalIndex(index);
    setModalVenueId(venueId);
    setIsModalOpen(true);
    handleCarouselChange(venueId, index);
  }, [handleCarouselChange]);

  useEffect(() => {
    let restoreTimeoutId: number | null = null;

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.scrollPosition);
      if (saved) {
        const data = JSON.parse(saved) as unknown;
        if (
          isStoredState(data) &&
          typeof data.y === "number" &&
          Date.now() - data.timestamp < RESTORE_TTL_MS
        ) {
          // Delay restore until after initial layout so the saved position is stable.
          restoreTimeoutId = window.setTimeout(() => window.scrollTo({ top: data.y }), 100);
        }
      }
    } catch {
      // Ignore malformed older localStorage entries.
    }

    let ticking = false;
    const saveScrollPosition = () => {
      try {
        // Keep only recent UI state; expired entries are ignored on the next visit.
        localStorage.setItem(STORAGE_KEYS.scrollPosition, JSON.stringify({
          y: window.scrollY,
          timestamp: Date.now(),
        }));
      } catch {
        // Ignore private browsing/storage quota failures.
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        saveScrollPosition();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", saveScrollPosition);

    return () => {
      if (restoreTimeoutId !== null) {
        window.clearTimeout(restoreTimeoutId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", saveScrollPosition);
    };
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalVenueId(null);
  }, []);

  const handleModalNavigate = useCallback((newIndex: number) => {
    setModalIndex(newIndex);
    if (modalVenueId) {
      handleCarouselChange(modalVenueId, newIndex);
    }
  }, [handleCarouselChange, modalVenueId]);

  return (
    <div className="container">
      <Header
        venueCount={venues.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />
      </Header>

      <VenueGrid
        venues={venues}
        carouselStates={carouselStates}
        onCarouselChange={handleCarouselChange}
        onImageClick={handleImageClick}
      />

      <Footer />

      <ImageModal
        images={modalImages}
        currentIndex={modalIndex}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
}

export default App;

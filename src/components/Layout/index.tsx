import { siteConfig } from "@/config/site.config";

const LAST_UPDATED_LABEL = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

interface HeaderProps {
    venueCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    children?: React.ReactNode; // For tabs
}

export function Header({ venueCount, searchQuery, onSearchChange, children }: HeaderProps) {
    return (
        <header className="header">
            {/* Row 1: Title + Subtitle + Count */}
            <div className="header-centered">
                <h1 className="header-title">{siteConfig.mainTitle}</h1>
                <span className="header-subtitle">{siteConfig.churchName}</span>
                <span className="header-stat">📍 {venueCount} بيت</span>
            </div>

            {/* Row 2: Search */}
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    className="search-input"
                    placeholder={siteConfig.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Tab Navigation (passed as children) */}
            {children}
        </header>
    );
}

export function Footer() {
    return (
        <footer className="footer">
            <p>{siteConfig.committeeName} {siteConfig.year} ⛺</p>
            <p>{siteConfig.sortingDescription}</p>
            <div className="last-updated">
                <span>🔄</span>
                <span>آخر تحديث: {LAST_UPDATED_LABEL}</span>
            </div>
        </footer>
    );
}

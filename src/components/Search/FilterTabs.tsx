import type { TabType } from "@/types";

interface FilterTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    counts: Record<TabType, number>;
}

// Tab configuration - easily extensible (Fixes Issue #11)
const tabConfig: { id: TabType; icon: string; label: string }[] = [
    { id: "favorites", icon: "⭐", label: "المفضلة" },
    { id: "rest", icon: "📋", label: "الباقي" },
];

export function FilterTabs({ activeTab, onTabChange, counts }: FilterTabsProps) {
    return (
        <div className="tab-navigation">
            {tabConfig.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    data-tab={tab.id}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                    <span className="tab-count">{counts[tab.id]}</span>
                </button>
            ))}
        </div>
    );
}

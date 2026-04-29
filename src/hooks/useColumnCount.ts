import { useEffect, useState } from "react";
import { getColumnCount } from "@/config/layout.config";

const getInitialColumnCount = () => {
    if (typeof window === "undefined") {
        return getColumnCount(0);
    }

    return getColumnCount(window.innerWidth);
};

export function useColumnCount() {
    const [columnCount, setColumnCount] = useState(getInitialColumnCount);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        let lastWidth = window.innerWidth;

        const handleResize = () => {
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                setColumnCount(getColumnCount(window.innerWidth));
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return columnCount;
}

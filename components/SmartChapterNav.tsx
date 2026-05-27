'use client';

import { useEffect, useState, useRef } from 'react';

export default function SmartChapterNav({ children }: { children: React.ReactNode }) {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 50) {
                setIsHeaderVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            if (document.activeElement?.tagName === 'INPUT') {
                setIsHeaderVisible(true);
                return;
            }

            // Logic bắt cặp chuẩn 100% với file SmartHeader của ông
            if (currentScrollY > lastScrollY.current) {
                setIsHeaderVisible(false); // Khi header ẩn -> thanh này phải ép lên top-0
            } else {
                setIsHeaderVisible(true);  // Khi header hiện -> thanh này phải lùi xuống top-16
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            className={`w-full bg-white border-b border-gray-200 py-3 sticky z-40 shadow-sm transition-all duration-300 ${
                isHeaderVisible ? 'top-16' : 'top-0'
            }`}
        >
            {children}
        </div>
    );
}
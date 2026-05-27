'use client';

import { useEffect, useState, useRef } from 'react';

export default function SmartHeader({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 1. Nếu cuộn sát lên đỉnh đầu (dưới 50px), luôn luôn hiện Header
            if (currentScrollY < 50) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            // 2. Nếu người dùng đang tập trung gõ chữ vào ô tìm kiếm thì KHÔNG ẩn header
            if (document.activeElement?.tagName === 'INPUT') {
                setIsVisible(true);
                return;
            }

            // 3. Logic đóng mở: Cuộn xuống ẩn đi, cuộn ngược lên hiện lại
            if (currentScrollY > lastScrollY.current) {
                // Đang cuộn xuống -> Ẩn
                setIsVisible(false);
            } else {
                // Đang cuộn ngược lên -> Hiện
                setIsVisible(true);
            }

            // Lưu lại tọa độ cuộn để so sánh cho lần sau
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`bg-white dark:bg-gray-900 border-b border-transparent dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-all duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {children}
        </header>
    );
}
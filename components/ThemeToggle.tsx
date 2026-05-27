'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Kiểm tra xem người dùng trước đó đã từng chọn tối chưa
        const savedTheme = localStorage.getItem('dt_comic_theme');

        if (savedTheme === 'dark') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            if (!savedTheme) {
                localStorage.setItem('dt_comic_theme', 'light');
            }
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('dt_comic_theme', 'dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dt_comic_theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0 flex items-center justify-center cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm"
            style={{ width: '36px', height: '36px' }}
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                /* 🌙 ICON MẶT TRĂNG (Hiện rõ nét ở nền SÁNG để người dùng bấm chuyển sang TỐI) */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-700">
                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5a10.503 10.503 0 0 1 6.794-9.694.75.75 0 0 1 .819.162Z" clipRule="evenodd" />
                </svg>
            ) : (
                /* ☀️ ICON MẶT TRỜI (Hiện rực rỡ ở nền TỐI để người dùng bấm quay lại SÁNG) */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.161 5.1a.75.75 0 0 1 1.06 0l1.591 1.591a.75.75 0 1 1-1.06 1.06L6.161 6.16a.75.75 0 0 1 0-1.06Zm11.678 0a.75.75 0 0 1 0 1.06l-1.591 1.59a.75.75 0 1 1-1.06-1.06l1.591-1.591a.75.75 0 0 1 1.06 0ZM12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Zm-8.25 5.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm12.75 0a.75.75 0 0 1 .75-.75H21a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75Zm-11.34 5.16a.75.75 0 0 1 1.06 0l1.591 1.591a.75.75 0 1 1-1.06 1.06L5.161 18.82a.75.75 0 0 1 0-1.06Zm11.678 0a.75.75 0 0 1 0 1.06l-1.591 1.591a.75.75 0 1 1-1.06-1.06l1.591-1.59a.75.75 0 0 1 1.06 0ZM12 17.25a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Z" />
                </svg>
            )}
        </button>
    );
}
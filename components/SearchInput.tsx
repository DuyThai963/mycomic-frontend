'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
    const [keyword, setKeyword] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md">
            <input
                type="text"
                placeholder="Tìm truyện..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-1.5 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
        </form>
    );
}
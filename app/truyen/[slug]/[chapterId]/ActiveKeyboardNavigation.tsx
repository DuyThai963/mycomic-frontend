'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActiveKeyboardNavigation({ prevUrl, nextUrl }: { prevUrl: string | null; nextUrl: string | null }) {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }
            if (e.key === 'ArrowLeft' && prevUrl) router.push(prevUrl);
            if (e.key === 'ArrowRight' && nextUrl) router.push(nextUrl);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevUrl, nextUrl, router]);

    return null;
}
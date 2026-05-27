'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HistoryItem {
    slug: string;
    comicName: string;
    thumbUrl: string;
    chapterId: string;
    chapterName: string;
    lastPage?: number;
}

export default function ContinueReading() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isMounted, setIsMounted] = useState(false); // Thêm state này để check client-side

    const loadHistory = () => {
        const localData = localStorage.getItem('dt_comic_history');
        if (localData) {
            setHistory(JSON.parse(localData));
        }
    };

    useEffect(() => {
        loadHistory();
        setIsMounted(true); // Đã chạy xong ở client, set thành true
    }, []);

    // Hàm xử lý xóa bộ truyện khỏi lịch sử đọc dở
    const handleDelete = (slugToDelete: string, e: React.MouseEvent) => {
        e.preventDefault();
        const localData = localStorage.getItem('dt_comic_history');
        if (localData) {
            const currentHistory: HistoryItem[] = JSON.parse(localData);
            const updatedHistory = currentHistory.filter(item => item.slug !== slugToDelete);
            localStorage.setItem('dt_comic_history', JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
        }
    };

    // BẮT BUỘC: Nếu chưa mount xong ở client, trả về null để tránh lỗi Hydration của Next.js
    if (!isMounted) return null;

    // Nếu đã mount xong ở client mà thực sự không có lịch sử thì mới ẩn
    if (history.length === 0) return null;

    const getImageUrl = (thumb_url: string) => {
        const CDN_URL = process.env.NEXT_PUBLIC_IMAGE_CDN || 'https://img.otruyenapi.com/uploads/comics';
        return `${CDN_URL}/${thumb_url}`;
    };

    return (
        /* 🟢 ĐÃ SỬA: Thêm dark:border-gray-800 cho đường kẻ phân tách khối */
        <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-100 để tiêu đề khối không bị đen mờ */}
            <h2 className="text-base font-bold text-gray-950 dark:text-gray-100 mb-4 flex items-center gap-2">
                ⏱️ Truyện bạn đang đọc dở
            </h2>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
                {history.map((item) => (
                    <div 
                        key={item.slug} 
                        /* 🟢 ĐÃ SỬA: Đảm bảo đồng bộ màu card nền tối */
                        className="w-[280px] shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-2.5 flex gap-3 snap-start relative group transition-all"
                    >
                        {/* 🟢 ĐÃ SỬA: Thêm dark:hover:bg-gray-800 cho nút xóa ✕ */}
                        <button
                            onClick={(e) => handleDelete(item.slug, e)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 leading-none transition-colors z-10"
                            title="Xóa khỏi lịch sử đọc"
                        >
                            ✕
                        </button>

                        {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-950 dark:border-gray-800 cho khung bọc ảnh bìa */}
                        <div className="w-[60px] h-[85px] relative rounded overflow-hidden shrink-0 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                            <Image 
                                  src={getImageUrl(item.thumbUrl)} 
                                  alt={item.comicName} 
                                  fill
                                  sizes="60px"
                                  className="object-cover"
                              />
                        </div>

                        <div className="flex flex-col justify-between overflow-hidden flex-1 pr-4">
                            <div>
                                {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-200 để tên truyện sáng rõ nét */}
                                <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-sm truncate" title={item.comicName}>
                                    {item.comicName}
                                </h3>
                                {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-400 và dark:text-gray-300 cho phần số chương, trang */}
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                    Dừng ở: <span className="font-medium text-gray-800 dark:text-gray-300">
                                        Chap {item.chapterName} {item.lastPage && item.lastPage > 1 ? `(Trang ${item.lastPage})` : ''}
                                    </span>
                                </p>
                            </div>
                            
                            <Link 
                                href={`/truyen/${item.slug}/${item.chapterId}`}
                                className="text-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-1.5 px-3 rounded transition-colors block w-full"
                            >
                                Đọc tiếp ❯
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
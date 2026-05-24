'use client';

import { useEffect } from 'react';

interface HistoryItem {
    slug: string;
    comicName: string;
    thumbUrl: string;
    chapterId: string;
    chapterName: string;
    updatedAt: number;
}

interface SaveHistoryProps {
    slug: string;
    comicName: string;
    thumbUrl: string;
    chapterId: string;
    chapterName: string;
}

export default function SaveHistory({ slug, comicName, thumbUrl, chapterId, chapterName }: SaveHistoryProps) {
    useEffect(() => {
        // Đảm bảo chỉ chạy dưới môi trường client browser
        if (typeof window === 'undefined') return;

        try {
            // 1. Lấy mảng cũ từ localStorage
            const localData = localStorage.getItem('dt_comic_history');
            let history: HistoryItem[] = localData ? JSON.parse(localData) : [];

            // 2. Tạo đối tượng lịch sử mới
            const newItem: HistoryItem = {
                slug,
                comicName,
                thumbUrl,
                chapterId,
                chapterName,
                updatedAt: Date.now()
            };

            // 3. Lọc trùng: Nếu bộ truyện này đã có trong lịch sử thì xóa bản cũ đi
            history = history.filter(item => item.slug !== slug);
            
            // 4. Đẩy tập mới đọc lên đầu danh sách và giới hạn tối đa 12 bộ
            history.unshift(newItem);
            if (history.length > 12) {
                history.pop();
            }

            // 5. Ép lưu thẳng xuống localStorage
            localStorage.setItem('dt_comic_history', JSON.stringify(history));
            console.log('[SUCCESS] Đã ghi nhận lịch sử đọc truyện:', comicName);
        } catch (error) {
            console.error('[ERROR] Không thể lưu lịch sử đọc:', error);
        }
    }, []); // Bỏ dependency array về rỗng [] để ép thực thi ngay khi mount trang đọc

    return null;
}
'use client';

import { useEffect } from 'react';

interface HistoryItem {
    slug: string;
    comicName: string;
    thumbUrl: string;
    chapterId: string;
    chapterName: string;
    updatedAt: number;
    lastPage: number;
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

        const historyKey = 'dt_comic_history';
        let isCurrentChapter = true;
        let allowTracking = false;
        window.scrollTo(0, 0);
        let initialSavedPage = 1;

        try {
            const localData = localStorage.getItem(historyKey);
            let history: HistoryItem[] = localData ? JSON.parse(localData) : [];

            // Kiểm tra xem bộ truyện này trước đó đã có lịch sử chưa
            const oldRecord = history.find(item => item.slug === slug);
            
            // Nếu đúng là đang vào lại cái chap cũ đã lưu trước đó, lấy số trang cũ ra để cuộn
            if (oldRecord && oldRecord.chapterId === chapterId) {
                initialSavedPage = oldRecord.lastPage || 1;
            }

            // Tạo đối tượng lịch sử mới (hoặc cập nhật lại tập mới nhất)
            const newItem: HistoryItem = {
                slug,
                comicName,
                thumbUrl,
                chapterId,
                chapterName,
                updatedAt: Date.now(),
                lastPage: initialSavedPage // Giữ lại trang cũ nếu trùng chap, hoặc set về 1 nếu là chap mới tinh
            };

            // Lọc trùng và đẩy lên đầu
            history = history.filter(item => item.slug !== slug);
            history.unshift(newItem);
            if (history.length > 12) history.pop();

            localStorage.setItem(historyKey, JSON.stringify(history));
        } catch (error) {
            console.error('[ERROR] Lỗi khởi tạo lịch sử:', error);
        }

        // --- ĐOẠN 1: TỰ ĐỘNG CUỘN DỰA TRÊN OBJECT LỊCH SỬ TỔNG ---
        const timer = setTimeout(() => {
            if (!isCurrentChapter) return;

            // Chỉ kích hoạt cuộn nếu trang đọc dở lớn hơn 1 (đỡ mất công tính toán khi ở trang đầu)
            if (initialSavedPage > 1) {
                const targetPageIndex = initialSavedPage - 1; // Khớp lại với index mảng ảnh (0-indexed)
                const targetPageElement = document.getElementById(`page-wrapper-${targetPageIndex}`);
                
                if (targetPageElement) {
                    const imgElement = targetPageElement.querySelector('img');

                    const performScroll = () => {
                        if (!isCurrentChapter || !window.location.href.includes(chapterId)) return;

                        setTimeout(() => {
                            if (isCurrentChapter && window.location.href.includes(chapterId)) {
                                console.log(`🚀 [SCROLL CHUẨN] Cuộn đến trang đọc dở cũ: ${initialSavedPage}`);
                                targetPageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                
                                setTimeout(() => { allowTracking = true; }, 300);
                            }
                        }, 100);
                    };

                    if (imgElement && imgElement.complete) {
                        performScroll();
                    } else if (imgElement) {
                        imgElement.addEventListener('load', performScroll);
                    }
                } else {
                    allowTracking = true;
                }
            } else {
                allowTracking = true; // Trang 1 thì bật theo dõi luôn không cần cuộn
            }
        }, 400);

        // --- ĐOẠN 2: OBSERVER THEO DÕI VÀ GHI ĐÈ THẲNG VÀO MẢNG OBJECT TỔNG ---
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (!allowTracking) return;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const pageIndex = entry.target.getAttribute('data-page');
                    if (pageIndex) {
                        const currentPageNum = Number(pageIndex) + 1;

                        try {
                            const localData = localStorage.getItem(historyKey);
                            if (localData) {
                                let historyList: HistoryItem[] = JSON.parse(localData);
                                const idx = historyList.findIndex(item => item.slug === slug);
                                
                                // Chỉ cập nhật nếu vẫn đang ở đúng chap đó
                                if (idx !== -1 && historyList[idx].chapterId === chapterId) {
                                    // 🎯 NẾU SỐ TRANG CÓ SỰ THAY ĐỔI THÌ MỚI GHI ĐÈ, ĐỠ TỐN CPU LƯU LIÊN TỤC
                                    if (historyList[idx].lastPage !== currentPageNum) {
                                        historyList[idx].lastPage = currentPageNum;
                                        historyList[idx].updatedAt = Date.now(); // Cập nhật thời gian tương tác mới nhất
                                        localStorage.setItem(historyKey, JSON.stringify(historyList));
                                    }
                                }
                            }
                        } catch (err) {}
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const pageElements = document.querySelectorAll('.comic-page-item');
        pageElements.forEach((el) => observer.observe(el));

        return () => {
            isCurrentChapter = false;
            allowTracking = false;
            clearTimeout(timer);
            pageElements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };

    }, [slug, chapterId, comicName, thumbUrl, chapterName]);

    return null;
}
'use client';

import { useEffect, useState, useRef } from 'react';

// Khai báo để TypeScript không bắt lỗi biến toàn cục bẫy trùng prefetch
declare global {
    interface Window {
        PREFETCHED_CHAPS?: string[];
    }
}

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
    totalPages: number; // 🟢 Nhận tổng số trang ảnh từ server truyền sang
}

export default function SaveHistory({ slug, comicName, thumbUrl, chapterId, chapterName, totalPages }: SaveHistoryProps) {
    // 🟢 CÁC STATE PHỤC VỤ BỘ CHỌN TRANG TRÊN MOBILE
    const [currentPage, setCurrentPage] = useState(1);
    const [isCurrentChapter, setIsCurrentChapter] = useState(true);
    const allowTrackingRef = useRef(false);
    const lastScrollY = useRef(0);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const historyKey = 'dt_comic_history';
        setIsCurrentChapter(true);

        // Ép cuộn lên đỉnh ngay khi vào chap mới
        window.scrollTo(0, 0);

        let initialSavedPage = 1;

        try {
            const localData = localStorage.getItem(historyKey);
            let history: HistoryItem[] = localData ? JSON.parse(localData) : [];

            const oldRecord = history.find(item => item.slug === slug);
            if (oldRecord && oldRecord.chapterId === chapterId) {
                initialSavedPage = oldRecord.lastPage || 1;
                setCurrentPage(initialSavedPage); // Đồng bộ số trang hiển thị ban đầu
            }

            const newItem: HistoryItem = {
                slug,
                comicName,
                thumbUrl,
                chapterId,
                chapterName,
                updatedAt: Date.now(),
                lastPage: initialSavedPage
            };

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

            if (initialSavedPage > 1) {
                const targetPageIndex = initialSavedPage - 1;
                const targetPageElement = document.getElementById(`page-wrapper-${targetPageIndex}`);
                
                if (targetPageElement) {
                    const imgElement = targetPageElement.querySelector('img');

                    const performScroll = () => {
                        if (!isCurrentChapter || !window.location.href.includes(chapterId)) return;

                        setTimeout(() => {
                            if (window.location.href.includes(chapterId)) {
                                targetPageElement.scrollIntoView({ behavior: 'auto', block: 'start' });
                                
                                setTimeout(() => { allowTrackingRef.current = true; }, 300);
                            }
                        }, 50);
                    };

                    if (imgElement && imgElement.complete) {
                        performScroll();
                    } else if (imgElement) {
                        imgElement.addEventListener('load', performScroll);
                    }
                } else {
                    allowTrackingRef.current = true;
                }
            } else {
                allowTrackingRef.current = true;
            }
        }, 400);

        // --- ĐOẠN 2: OBSERVER THEO DÕI LƯU TRANG VÀ THEO DÕI TRẠNG THÁI SCROLL HEADER ---
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (!allowTrackingRef.current) return;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const pageIndex = entry.target.getAttribute('data-page');
                    if (pageIndex) {
                        const currentPageNum = Number(pageIndex) + 1;
                        setCurrentPage(currentPageNum); // 🟢 ĐỒNG BỘ SỐ TRANG LÊN WIDGET MOBILE REAL-TIME

                        // Cập nhật vị trí trang vào localStorage
                        try {
                            const localData = localStorage.getItem(historyKey);
                            if (localData) {
                                let historyList: HistoryItem[] = JSON.parse(localData);
                                const idx = historyList.findIndex(item => item.slug === slug);
                                
                                if (idx !== -1 && historyList[idx].chapterId === chapterId) {
                                    if (historyList[idx].lastPage !== currentPageNum) {
                                        historyList[idx].lastPage = currentPageNum;
                                        localStorage.setItem(historyKey, JSON.stringify(historyList));
                                    }
                                }
                            }
                        } catch (err) {}

                        // LOGIC MỒI ẢNH CHƯƠNG TIẾP THEO KHI SẮP HẾT TRUYỆN
                        if (totalPages > 3 && currentPageNum >= totalPages - 3) {
                            const nextBtn = document.querySelector('a[href*="/truyen/"][class*="bg-blue-600"]');
                            if (nextBtn) {
                                const nextUrl = nextBtn.getAttribute('href');
                                if (nextUrl && !window.PREFETCHED_CHAPS?.includes(nextUrl)) {
                                    if (!window.PREFETCHED_CHAPS) window.PREFETCHED_CHAPS = [];
                                    window.PREFETCHED_CHAPS.push(nextUrl);

                                    const prefetchNextPageData = async () => {
                                        try {
                                            const res = await fetch(nextUrl, { priority: 'low' });
                                            const htmlText = await res.text();
                                            const matchImageUrls = htmlText.match(/https:\/\/[^"'\s>]+?\.(jpg|jpeg|png|webp)/g);
                                            if (matchImageUrls && matchImageUrls.length > 0) {
                                                const top3Images = Array.from(new Set(matchImageUrls)).slice(0, 3);
                                                top3Images.forEach((imgUrl) => {
                                                    const imgLoader = new window.Image();
                                                    imgLoader.src = imgUrl;
                                                });
                                            }
                                        } catch (err) {}
                                    };
                                    prefetchNextPageData();
                                }
                            }
                        }

                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const pageElements = document.querySelectorAll('.comic-page-item');
        pageElements.forEach((el) => observer.observe(el));

        // Lắng nghe cuộn chuột bổ sung để ẩn/hiện widget đồng bộ theo thanh Smart Header
        const handleScrollNavbar = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50) {
                setIsHeaderVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                setIsHeaderVisible(false); // Đang lướt xuống -> ẩn luôn cả widget chọn trang cho thoáng mắt
            } else {
                setIsHeaderVisible(true);  // Khựng lại vuốt nhẹ lên -> Hiện widget lên để bấm chọn trang nhanh
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScrollNavbar, { passive: true });

        return () => {
            setIsCurrentChapter(false);
            allowTrackingRef.current = false;
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScrollNavbar);
            pageElements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };

    }, [slug, chapterId, comicName, thumbUrl, chapterName, totalPages]);

    // 🟢 HÀM XỬ LÝ KHI NGƯỜI DÙNG CHỌN NHẢY TRANG TRÊN DROP-DOWN MOBILE
    const handlePageSelect = (pageTarget: number) => {
        allowTrackingRef.current = false; // Tạm khóa xích theo dõi lưu bậy khi đang cuộn
        setCurrentPage(pageTarget);

        const targetPageElement = document.getElementById(`page-wrapper-${pageTarget - 1}`);
        if (targetPageElement) {
            targetPageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Cuộn trúng đích xong xuôi sau 500ms mở khóa observer tiếp tục ghi nhận
            setTimeout(() => {
                allowTrackingRef.current = true;
            }, 500);
        }
    };

    return (
        <div 
            className={`fixed bottom-6 right-4 z-50 transition-all duration-300 [@media(pointer:coarse)]:block [@media(pointer:fine)]:hidden ${
                isHeaderVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
            }`}
        >
            <div className="bg-black/80 backdrop-blur-md text-white text-xs font-bold rounded-full px-3 py-2 flex items-center gap-2 shadow-lg border border-white/10">
                <span>Trang</span>
                
                {/* Thanh Dropdown Select chính thống để chọn trang siêu nhanh */}
                <select 
                    value={currentPage}
                    onChange={(e) => handlePageSelect(Number(e.target.value))}
                    className="bg-gray-800 text-white rounded px-2 py-0.5 border border-gray-600 font-extrabold focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                >
                    {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
                
                <span className="text-gray-400 font-normal">/ {totalPages}</span>
            </div>
        </div>
    );
}
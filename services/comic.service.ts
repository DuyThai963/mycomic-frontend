import { HomeResponse } from '../types/comic';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const comicService = {
    // Lấy dữ liệu trang chủ
    async getHome(): Promise<HomeResponse> {
        const res = await fetch(`${API_URL}/home`, {
            next: { revalidate: 1800 } // Cache ở Next.js trong 30 phút
        });
        
        if (!res.ok) {
            throw new Error('Failed to fetch home data');
        }
        return res.json();
    },

    // Lấy chi tiết truyện
    async getComicDetail(slug: string): Promise<ComicDetailResponse> {
        const res = await fetch(`${API_URL}/truyen-tranh/${slug}`, {
            next: { revalidate: 300 } // Cache 5 phút
        });
        
        if (!res.ok) {
            throw new Error('Failed to fetch comic detail');
        }
        return res.json();
    },

    // Lấy chi tiết danh sách ảnh của một chapter
    async getChapterDetail(chapterId: string): Promise<ChapterDetailResponse> {
        const res = await fetch(`${API_URL}/chapter/${chapterId}`, {
            next: { revalidate: 3600 } // Chapter cũ rất ít khi sửa, cache hẳn 1 tiếng cho nhẹ
        });
        
        if (!res.ok) {
            throw new Error('Failed to fetch chapter images');
        }
        return res.json();
    },

    // Tìm kiếm truyện
    async searchComics(keyword: string): Promise<HomeResponse> {
        const res = await fetch(`${API_URL}/tim-kiem?keyword=${encodeURIComponent(keyword)}`, {
            cache: 'no-store' // Tìm kiếm liên tục thì không nên lưu cache cố định
        });
        if (!res.ok) {
            throw new Error('Search failed');
        }
        return res.json();
    },

    // Lấy danh sách truyện theo bộ lọc (truyen-moi, dang-phat-hanh, hoan-thanh,...)
    async getComicsByType(type: string, page: number = 1): Promise<HomeResponse> {
        const res = await fetch(`${API_URL}/danh-sach/${type}?page=${page}`, {
            next: { revalidate: 600 } // Cache danh sách 10 phút
        });
        if (!res.ok) {
            throw new Error('Failed to fetch list by type');
        }
        return res.json();
    },

    // Get helper cho URL ảnh
    getImageUrl(thumb_url: string) {
        const CDN_URL = process.env.NEXT_PUBLIC_IMAGE_CDN || 'https://img.otruyenapi.com/uploads/comics';
        return `${CDN_URL}/${thumb_url}`;
    }
};
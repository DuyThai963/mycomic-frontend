export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ChapterLatest {
    filename: string;
    chapter_name: string;
    chapter_title: string;
    chapter_api_data: string;
}

export interface Comic {
    _id: string;
    name: string;
    slug: string;
    origin_name: string[];
    status: string;
    thumb_url: string;
    sub_docquyen: boolean;
    category: Category[];
    updatedAt: string;
    chaptersLatest: ChapterLatest[];
}

export interface Pagination {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    pageRanges: number;
}

export interface HomeResponse {
    status: string;
    message: string;
    data: {
        items: Comic[];
        params: {
            pagination: Pagination;
        };
        type_list: string;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}

export interface ChapterItem {
    filename: string;
    chapter_name: string;
    chapter_title: string;
    chapter_api_data: string;
}

export interface ChapterServer {
    server_name: string;
    server_data: ChapterItem[];
}

export interface ComicDetail extends Comic {
    content: string;
    author: string[];
    chapters: ChapterServer[];
}

export interface ComicDetailResponse {
    status: string;
    message: string;
    data: {
        item: ComicDetail;
        seoOnPage: any;
    };
}

export interface ChapterImage {
    image_page: number;
    image_file: string;
}

export interface ChapterDetail {
    _id: string;
    comic_name: string;
    chapter_name: string;
    chapter_title: string;
    chapter_path: string;
    chapter_image: ChapterImage[];
}

export interface ChapterDetailResponse {
    status: string;
    message: string;
    data: {
        domain_cdn: string;
        item: ChapterDetail;
    };
}
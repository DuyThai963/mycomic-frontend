export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { comicService } from '@/services/comic.service';
import SaveHistory from '@/components/SaveHistory';
import ActiveKeyboardNavigation from './ActiveKeyboardNavigation';
import SmartChapterNav from '@/components/SmartChapterNav';

export default async function ChapterPage({ params }: { params: any }) {
    const resolvedParams = await params;
    const { slug, chapterId } = resolvedParams;

    // Gọi song song cả API danh sách ảnh và API chi tiết truyện để lấy danh sách chương
    const [chapterRes, comicRes] = await Promise.all([
        comicService.getChapterDetail(chapterId),
        comicService.getComicDetail(slug)
    ]);

    const { domain_cdn, item: chapter } = chapterRes.data;
    
    // Định nghĩa rõ ràng comicDetail để lấy thông tin tổng của truyện (tên, ảnh bìa)
    const comicDetail = comicRes.data.item;
    const chapterList = comicDetail.chapters?.[0]?.server_data || [];

    // Tìm vị trí của chương hiện tại trong danh sách
    const currentIdx = chapterList.findIndex((chap: any) => chap.chapter_api_data.endsWith(chapterId));

    // Hàm helper lấy ID từ URL
    const getChapterId = (url: string) => {
        if (!url) return '';
        return url.trim().split('/').pop() || '';
    };

    // Logic điều hướng tập (Đã đảo khớp với vị trí nút hiển thị)
    const nextChapter = currentIdx > 0 ? chapterList[currentIdx - 1] : null;
    const prevChapter = currentIdx < chapterList.length - 1 && currentIdx !== -1 ? chapterList[currentIdx + 1] : null;

    return (
        /* 🟢 ĐÃ SỬA: Đổi bg-gray-100 thành bg-transparent để ăn theo nền biến body tổng */
        <div className="min-h-screen bg-transparent flex flex-col items-center">
            {/* ÉP RENDER NGAY ĐẦU TRANG ĐỂ CHẠY LOCALSTORAGE LẬP TỨC */}
            <SaveHistory 
                slug={slug}
                comicName={comicDetail.name}
                thumbUrl={comicDetail.thumb_url}
                chapterId={chapterId}
                chapterName={chapter.chapter_name}
                totalPages={chapter.chapter_image.length}
            />

            <ActiveKeyboardNavigation 
                prevUrl={nextChapter ? `/truyen/${slug}/${getChapterId(nextChapter.chapter_api_data)}` : null}
                nextUrl={prevChapter ? `/truyen/${slug}/${getChapterId(prevChapter.chapter_api_data)}` : null}
            />

            {/* Thanh điều hướng nhanh trên đầu (bản thân SmartChapterNav đã được thêm dark:bg-gray-900 ở bước trước) */}
            <SmartChapterNav>
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between gap-2">
                    <Link href={`/truyen/${slug}`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline hidden md:block">
                        ← Danh sách chương
                    </Link>

                    {/* Cụm nút chuyển chương trên Header Navbar */}
                    <div className="flex items-center gap-2 mx-auto md:mx-0">
                        {/* Nút lùi tập */}
                        {nextChapter ? (
                            /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 */
                            <Link href={`/truyen/${slug}/${getChapterId(nextChapter.chapter_api_data)}`} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded transition-colors">
                                ❮ Trước
                            </Link>
                        ) : (
                            /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900/50 dark:text-gray-600 */
                            <button disabled className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/50 text-gray-400 dark:text-gray-600 text-xs font-semibold rounded cursor-not-allowed">❮ Trước</button>
                        )}

                        {/* Tên chương hiện tại */}
                        {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 */}
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded border dark:border-gray-700">
                            Chương {chapter.chapter_name}
                        </span>

                        {/* Nút tiến tập */}
                        {prevChapter ? (
                            <Link href={`/truyen/${slug}/${getChapterId(prevChapter.chapter_api_data)}`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors">
                                Sau ❯
                            </Link>
                        ) : (
                            /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900/50 dark:text-gray-600 */
                            <button disabled className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900/50 text-gray-400 dark:text-gray-600 text-xs font-semibold rounded cursor-not-allowed">Sau ❯</button>
                        )}
                    </div>
                </div>
            </SmartChapterNav>

            {/* Vùng nội dung ảnh truyện */}
            {/* 🟢 ĐÃ SỬA: Đổi bg-white thành bg-transparent để tiệp màu nền tối, thêm dark:border-gray-800 */}
            <div className="w-full max-w-3xl bg-transparent flex flex-col items-center shadow-sm my-4 border-x border-gray-200 dark:border-gray-800">
                {chapter.chapter_image.map((img: any, index: number) => {
                    const fullImgUrl = `${domain_cdn}/${chapter.chapter_path}/${img.image_file}`;
                    return (
                        <div 
                            key={img.image_page} 
                            id={`page-wrapper-${index}`}
                            data-page={index}
                            className="w-full relative comic-page-item"
                        >
                            <img src={fullImgUrl} alt={`Trang ${img.image_page + 1}`} loading="lazy" className="w-full h-auto block select-none pointer-events-none" />
                            <span className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {img.image_page + 1}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Điều hướng dưới đáy */}
            {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900 dark:border-gray-800 */}
            <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
                <div className="max-w-md mx-auto px-4 flex justify-center gap-4">
                    {nextChapter && (
                        /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 */
                        <Link href={`/truyen/${slug}/${getChapterId(nextChapter.chapter_api_data)}`} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-6 rounded-lg text-sm transition-colors">
                            Chương Trước
                        </Link>
                    )}
                    {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-700 dark:hover:bg-gray-600 */}
                    <Link href={`/truyen/${slug}`} className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors shadow">
                        Mục Lục
                    </Link>
                    {/* Nút chương sau giữ nguyên màu xanh làm điểm nhấn nổi bật */}
                    {prevChapter && (
                        <Link href={`/truyen/${slug}/${getChapterId(prevChapter.chapter_api_data)}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors">
                            Chương Sau
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
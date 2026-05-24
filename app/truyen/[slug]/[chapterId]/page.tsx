import Link from 'next/link';
import { comicService } from '@/services/comic.service';
import SaveHistory from '@/components/SaveHistory';

export default async function ChapterPage({ 
    params 
}: { 
    params: Promise<{ slug: string; chapterId: string }> 
}) {
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
    const currentIdx = chapterList.findIndex(chap => chap.chapter_api_data.endsWith(chapterId));

    // Hàm helper lấy ID từ URL
    const getChapterId = (url: string) => {
        if (!url) return '';
        return url.trim().split('/').pop() || '';
    };

    // Logic điều hướng tập (Đã đảo khớp với vị trí nút hiển thị)
    const nextChapter = currentIdx > 0 ? chapterList[currentIdx - 1] : null;
    const prevChapter = currentIdx < chapterList.length - 1 && currentIdx !== -1 ? chapterList[currentIdx + 1] : null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            {/* ÉP RENDER NGAY ĐẦU TRANG ĐỂ CHẠY LOCALSTORAGE LẬP TỨC */}
            <SaveHistory 
                slug={slug}
                comicName={comicDetail.name}
                thumbUrl={comicDetail.thumb_url}
                chapterId={chapterId}
                chapterName={chapter.chapter_name}
            />

            {/* Thanh điều hướng nhanh trên đầu */}
            <div className="w-full bg-white border-b border-gray-200 py-3 sticky top-16 z-40 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between gap-2">
                    <Link href={`/truyen/${slug}`} className="text-xs font-medium text-blue-600 hover:underline hidden md:block">
                        ← Danh sách chương
                    </Link>

                    {/* Cụm nút chuyển chương trên Header Navbar */}
                    <div className="flex items-center gap-2 mx-auto md:mx-0">
                        {/* Nút lùi tập */}
                        {nextChapter ? (
                            <Link href={`/truyen/${slug}/${getChapterId(nextChapter.chapter_api_data)}`} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded transition-colors">
                                ❮ Trước
                            </Link>
                        ) : (
                            <button disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded cursor-not-allowed">❮ Trước</button>
                        )}

                        {/* Tên chương hiện tại */}
                        <span className="text-xs font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded border">
                            Chương {chapter.chapter_name}
                        </span>

                        {/* Nút tiến tập */}
                        {prevChapter ? (
                            <Link href={`/truyen/${slug}/${getChapterId(prevChapter.chapter_api_data)}`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors">
                                Sau ❯
                            </Link>
                        ) : (
                            <button disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded cursor-not-allowed">Sau ❯</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Vùng nội dung ảnh */}
            <div className="w-full max-w-3xl bg-white flex flex-col items-center shadow-sm my-4 border-x border-gray-200">
                {chapter.chapter_image.map((img) => {
                    const fullImgUrl = `${domain_cdn}/${chapter.chapter_path}/${img.image_file}`;
                    return (
                        <div key={img.image_page} className="w-full relative">
                            <img src={fullImgUrl} alt={`Trang ${img.image_page + 1}`} loading="lazy" className="w-full h-auto block select-none pointer-events-none" />
                            <span className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {img.image_page + 1}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Điều hướng dưới đáy */}
            <div className="w-full bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="max-w-md mx-auto px-4 flex justify-center gap-4">
                    {nextChapter && (
                        <Link href={`/truyen/${slug}/${getChapterId(nextChapter.chapter_api_data)}`} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg text-sm transition-colors">
                            Chương Trước
                        </Link>
                    )}
                    <Link href={`/truyen/${slug}`} className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors shadow">
                        Mục Lục
                    </Link>
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
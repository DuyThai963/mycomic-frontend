import Image from 'next/image';
import Link from 'next/link';
import { comicService } from '@/services/comic.service';

export default async function ComicDetailPage({ params }: { params: any }) {
    // 1. Giải mã params trước khi dùng
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // 2. Gọi API lấy dữ liệu truyện bằng slug đã unwrap
    const response = await comicService.getComicDetail(slug);
    const comic = response.data.item;
    const imageUrl = comicService.getImageUrl(comic.thumb_url);

    // Lấy danh sách chapter (server đầu tiên)
    const chapterList = comic.chapters?.[0]?.server_data || [];

    // Tách ID chapter chuẩn chỉnh bằng Regex, chấp nhận cả URL dính khoảng trắng hay xuống dòng
    const getChapterId = (url: string) => {
        if (!url) return '';
        const cleanUrl = url.trim(); // Loại bỏ khoảng trắng thừa 2 đầu
        const match = cleanUrl.match(/\/chapter\/([a-zA-Z0-9]+)/);
        return match ? match[1] : cleanUrl.split('/').pop() || '';
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            {/* Vùng Thông tin truyện */}
            {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900/40 dark:border-gray-800 */}
            <div className="bg-white dark:bg-gray-900/40 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6 flex flex-col md:flex-row gap-6">
                {/* Ảnh bìa */}
                {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-950 */}
                <div className="shrink-0 mx-auto md:mx-0 w-[200px] h-[300px] relative rounded-lg overflow-hidden shadow-md bg-gray-50 dark:bg-gray-950">
                    <Image src={imageUrl} alt={comic.name} fill sizes="200px" className="object-cover" />
                </div>

                {/* Thông tin */}
                <div className="flex-1 flex flex-col">
                    {/* 🟢 ĐÃ SỬA: Thêm dark:text-white */}
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{comic.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {comic.category.map((cat: any) => (
                            /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-800 dark:text-gray-300 */
                            <span key={cat.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-sm font-medium">
                                {cat.name}
                            </span>
                        ))}
                    </div>
                    
                    {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-300 và dark:text-gray-100 cho các nhãn label */}
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                        <p><span className="font-semibold text-gray-900 dark:text-gray-100">Tác giả:</span> {comic.author?.join(', ') || 'Đang cập nhật'}</p>
                        <p><span className="font-semibold text-gray-900 dark:text-gray-100">Trạng thái:</span> {comic.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành'}</p>
                    </div>

                    {/* Nút Đọc ngay */}
                    {chapterList.length > 0 && (
                        <div className="mt-auto">
                            <Link 
                                href={`/truyen/${slug}/${getChapterId(chapterList[0].chapter_api_data)}`}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
                            >
                                Đọc Từ Đầu
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Vùng Tóm tắt */}
            {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900/40 dark:border-gray-800, dark:text-white, dark:border-gray-800, dark:text-gray-300 */}
            <div className="mt-8 bg-white dark:bg-gray-900/40 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-2">Nội dung truyện</h2>
                <div 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{ __html: comic.content || 'Chưa có tóm tắt.' }} 
                />
            </div>

            {/* Vùng Danh sách Chapter */}
            {/* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900/40 dark:border-gray-800, dark:text-white, dark:border-gray-800 */}
            <div className="mt-8 bg-white dark:bg-gray-900/40 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-2">Danh sách chương</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {chapterList.map((chap, index) => (
                        /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 */
                        <Link 
                            key={`${chap.chapter_name}-${index}`}
                            href={`/truyen/${slug}/${getChapterId(chap.chapter_api_data)}`}
                            className="bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 p-3 rounded text-center text-sm font-medium transition-colors"
                        >
                            Chương {chap.chapter_name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
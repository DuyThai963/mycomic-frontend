export const dynamic = 'force-dynamic';
import { comicService } from '@/services/comic.service';
import ComicCard from '@/components/ComicCard';
import ContinueReading from '@/components/ContinueReading';
import Link from 'next/link';

export default async function Home() {
    // Gọi API lấy dữ liệu trang chủ trực tiếp từ Server Component
    const response = await comicService.getHome();
    const comics = response.data.items || [];

    return (
        /* 🟢 ĐÃ SỬA: Bỏ bg-white, thay bằng bg-transparent để nó ăn theo màu biến body. Hoặc dùng bg-white dark:bg-gray-950 */
        <main className="min-h-screen bg-transparent p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Thanh điều hướng/phân loại basic - Đã thêm dark:... */}
                <div className="flex flex-wrap gap-2 items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mr-2">Phân loại:</span>
                    <Link href="/danh-sach/dang-phat-hanh" className="px-3 py-1 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 text-xs font-medium transition-all">
                        ⏳ Đang phát hành
                    </Link>
                    <Link href="/danh-sach/hoan-thanh" className="px-3 py-1 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 text-xs font-medium transition-all">
                        ✅ Đã hoàn thành
                    </Link>
                    <Link href="/danh-sach/sap-ra-mat" className="px-3 py-1 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 text-xs font-medium transition-all">
                        🚀 Sắp ra mắt
                    </Link>
                </div>

                <ContinueReading />

                {/* Tiêu đề trang - Đã sửa màu chữ tự thích ứng dark:text-white */}
                <div className="flex items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white border-l-4 border-blue-600 pl-3 leading-none">
                        Truyện Mới Cập Nhật
                    </h1>
                </div>
                
                {/* Lưới hiển thị danh sách truyện basic */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {comics.map((comic, index) => (
                        <ComicCard key={`${comic._id}-${index}`} comic={comic} />
                    ))}
                </div>
            </div>
        </main>
    );
}
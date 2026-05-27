import Image from 'next/image';
import Link from 'next/link';
import { Comic } from '../types/comic';
import { comicService } from '../services/comic.service';

export default function ComicCard({ comic }: { comic: Comic }) {
    const imageUrl = comicService.getImageUrl(comic.thumb_url);
    const latestChapter = comic.chaptersLatest?.[0]?.chapter_name || '??';
    
    // Lấy tên thể loại đầu tiên trong mảng để hiển thị tag phụ
    const primaryCategory = comic.category?.[0]?.name || 'Truyện';

    return (
        <Link 
            href={`/truyen/${comic.slug}`} 
            /* 🟢 ĐÃ SỬA: Thêm dark:bg-gray-900/40 dark:border-gray-800 dark:hover:shadow-black/30 */
            className="group flex flex-col bg-white dark:bg-gray-900/40 rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 dark:border-gray-800 overflow-hidden transition-all duration-300"
        >
            {/* Cover Image Area */}
            <div className="relative w-full aspect-[2/3] bg-gray-50 dark:bg-gray-950 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={comic.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 15vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={true}
                />
                
                {/* Trạng thái góc trên bên trái card - Thêm dark:... cho tag */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {comic.status === 'ongoing' ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md shadow-sm">
                            Đang ra
                        </span>
                    ) : comic.status === 'coming_soon' ? (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded-md shadow-sm">
                            Sắp chiếu
                        </span>
                    ) : null}
                </div>

                {/* Thanh đen mờ bọc chân ảnh hiển thị chapter */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-8 pb-2 px-2.5">
                    <span className="text-white text-[11px] font-bold px-2 py-0.5 bg-blue-600 rounded shadow-sm">
                        Chap {latestChapter}
                    </span>
                </div>
            </div>

            {/* Content Text Info Area */}
            {/* 🟢 ĐÃ SỬA: Đổi bg-white thành bg-transparent để ăn theo nền card tổng */}
            <div className="p-3 flex flex-col flex-grow bg-transparent">
                {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-200 và dark:group-hover:text-blue-400 */}
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 flex-grow" title={comic.name}>
                    {comic.name}
                </h3>
                
                {/* Tag thể loại nhỏ xinh dưới chân card - Thêm dark:border-gray-800 */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    {/* 🟢 ĐÃ SỬA: Thêm dark:text-gray-500 */}
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">
                        🏷️ {primaryCategory}
                    </span>
                </div>
            </div>
        </Link>
    );
}
import { comicService } from '@/services/comic.service';
import ComicCard from '@/components/ComicCard';

export default async function DynamicListPage({ 
    params 
}: { 
    params: Promise<{ type: string }> 
}) {
    const resolvedParams = await params;
    const { type } = resolvedParams;

    const response = await comicService.getComicsByType(type);
    const comics = response.data.items || [];
    
    // Đổi slug type thành tiêu đề tiếng Việt cho sáng sủa UI
    const getTitle = (slug: string) => {
        if (slug === 'dang-phat-hanh') return 'Truyện Đang Phát Hành';
        if (slug === 'hoan-thanh') return 'Truyện Đã Hoàn Thành';
        if (slug === 'sap-ra-mat') return 'Truyện Sắp Ra Mắt';
        return 'Danh Sách Truyện';
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-3 leading-none">
                    {getTitle(type)}
                </h1>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {comics.map((comic) => (
                        <ComicCard key={comic._id} comic={comic} />
                    ))}
                </div>
            </div>
        </main>
    );
}
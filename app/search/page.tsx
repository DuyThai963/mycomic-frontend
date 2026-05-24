import { comicService } from '@/services/comic.service';
import ComicCard from '@/components/ComicCard';

export default async function SearchPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ q?: string }> 
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || '';

    const response = await comicService.searchComics(query);
    const comics = response.data.items || [];

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl font-bold text-gray-800 mb-6">
                    Kết quả tìm kiếm cho: <span className="text-blue-600">"{query}"</span>
                </h1>
                
                {comics.length === 0 ? (
                    <p className="text-gray-500">Không tìm thấy bộ truyện nào phù hợp.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {comics.map((comic, index) => (
                            <ComicCard key={`${comic._id}-${index}`} comic={comic} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
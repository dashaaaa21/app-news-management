import type { INews } from '../../common/types/news-type';
import NewsCard from './NewsCard';

interface NewsGridProps {
    news: INews[];
}

export default function NewsGrid({ news }: NewsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
            {news.map((item, index) => (
                <NewsCard key={item.id || item._id || index} news={item} />
            ))}
        </div>
    );
}

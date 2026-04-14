import type { INews } from '../../common/types/news-type';
import { Button } from '../ui/buttons/Button';
import { useNavigate, useLocation } from 'react-router-dom';

interface NewsCardProps {
    news: INews;
}

export default function NewsCard({ news }: NewsCardProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const getRole = () => {
        if (location.pathname.includes('/admin/')) return 'admin';
        if (location.pathname.includes('/reporter/')) return 'reporter';
        if (location.pathname.includes('/manager/')) return 'manager';
        return 'admin';
    };

    const role = getRole();

    const handleView = () => {
        navigate(`/${role}/staff-news/${news.id}`);
    };

    const handleEdit = () => {
        navigate(`/${role}/staff-news/${news.id}/edit`);
    };

    return (
        <div className="bg-transparent rounded-[16px] sm:rounded-[20px] overflow-hidden border border-black/10">
            <img
                src={news.image}
                alt={news.title}
                className="w-full h-40 sm:h-48 object-cover"
            />
            <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold mb-2 line-clamp-2 min-h-[40px] sm:min-h-[48px]">
                    {news.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                    {news.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 sm:mb-4">
                    <span className="truncate">{news.category}</span>
                    <span>•</span>
                    <span className="truncate">{news.readTime}</span>
                </div>
                <div className="space-y-2">
                    <Button
                        onClick={handleView}
                        variant="secondary"
                        className="w-full rounded-[16px] sm:rounded-[20px] text-sm sm:text-base"
                    >
                        More
                    </Button>
                    {role !== 'manager' && (
                        <Button
                            onClick={handleEdit}
                            variant="primary"
                            className="w-full rounded-[16px] sm:rounded-[20px] text-sm sm:text-base"
                        >
                            Edit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

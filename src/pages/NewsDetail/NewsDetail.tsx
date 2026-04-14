import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    getNewsByIdLegacy,
    MOCK_NEWS_DETAIL,
} from '../../api/api-news/api-news';
import type { INews } from '../../common/types/news-type';
import { Button } from '../../components/ui/buttons/Button';
import NewsDetailBreadcrumbs from '../../components/sectionNewsDetail/NewsDetailBreadcrumbs';
import NewsDetailHero from '../../components/sectionNewsDetail/NewsDetailHero';
import RelatedNewsGrid from '../../components/sectionNewsDetail/RelatedNewsGrid';
import NewsDetailContent from '../../components/sectionNewsDetail/NewsDetailContent';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [news, setNews] = useState<INews | null>(null);
    const [loading, setLoading] = useState(true);
    const isEditMode = location.pathname.includes('/edit');
    const [title, setTitle] = useState(MOCK_NEWS_DETAIL.title);
    const [heroDescription, setHeroDescription] = useState(
        MOCK_NEWS_DETAIL.heroDescription,
    );
    const [content1, setContent1] = useState(MOCK_NEWS_DETAIL.content1);
    const [content2, setContent2] = useState(MOCK_NEWS_DETAIL.content2);
    const [relatedNews, setRelatedNews] = useState(
        MOCK_NEWS_DETAIL.relatedNews,
    );

    const getRole = () => {
        if (location.pathname.includes('/admin/')) return 'admin';
        if (location.pathname.includes('/reporter/')) return 'reporter';
        if (location.pathname.includes('/manager/')) return 'manager';
        return 'admin';
    };

    const role = getRole();

    useEffect(() => {
        const fetchNews = async () => {
            if (!id) return;
            setLoading(true);
            const data = await getNewsByIdLegacy(Number(id));
            setNews(data || null);
            setLoading(false);
        };

        fetchNews();
    }, [id]);

    const handleSave = () => {
        alert('News saved successfully!');
        navigate(`/${role}/staff-news`);
    };

    const handleBack = () => {
        navigate(`/${role}/staff-news`);
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <p className="mb-4">News not found</p>
                    <Button
                        onClick={handleBack}
                        variant="secondary"
                        className="rounded-[20px] px-12"
                    >
                        Back to News
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-center gap-4">
                    <Button
                        onClick={handleBack}
                        variant="secondary"
                        className="rounded-[20px] px-12"
                    >
                        Back
                    </Button>
                    {isEditMode && (
                        <Button
                            onClick={handleSave}
                            variant="primary"
                            className="rounded-[20px] px-12"
                        >
                            Save
                        </Button>
                    )}
                </div>

                <div className="bg-transparent rounded-[36px] border border-black/10 p-4 md:p-6">
                    <NewsDetailBreadcrumbs />
                    <NewsDetailHero
                        title={title}
                        description={heroDescription}
                        isEditing={isEditMode}
                        onTitleChange={setTitle}
                        onDescriptionChange={setHeroDescription}
                    />
                    <RelatedNewsGrid
                        relatedNews={relatedNews}
                        isEditing={isEditMode}
                        onUpdateNews={setRelatedNews}
                    />
                    <div className="mb-8 md:mb-12">
                        <NewsDetailContent
                            content={content1}
                            isEditing={isEditMode}
                            onContentChange={setContent1}
                        />
                    </div>
                    <NewsDetailContent
                        content={content2}
                        isEditing={isEditMode}
                        onContentChange={setContent2}
                    />
                </div>
            </div>
        </div>
    );
}

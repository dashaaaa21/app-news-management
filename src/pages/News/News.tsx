import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllNewsLegacy } from '../../api/api-news/api-news';
import { useNews } from '../../common/hooks/useNews';
import type {
    INews,
    INewsResponse,
    ICreateNewsRequest,
} from '../../common/types/news-type';
import NewsHeader from '../../components/sectionNews/NewsHeader';
import NewsGrid from '../../components/sectionNews/NewsGrid';
import LoadMoreButton from '../../components/sectionNews/LoadMoreButton';
import LoadingState from '../../components/sectionNews/LoadingState';
import { NewsForm } from '../../components/news/NewsForm';
import { Button } from '../../components/ui/buttons/Button';
import XIcon from '../../components/icons/XIcon';

export default function News() {
    const location = useLocation();
    const [news, setNews] = useState<INews[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCrudMode, setShowCrudMode] = useState(false);

    const {
        news: crudNews,
        isLoading: crudLoading,
        error,
        fetchAllNews,
        createNewNews,
        updateExistingNews,
        deleteExistingNews,
        clearError,
    } = useNews();

    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState<INewsResponse | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const getUserRole = () => {
        if (location.pathname.includes('/admin/')) return 'admin';
        if (location.pathname.includes('/reporter/')) return 'reporter';
        if (location.pathname.includes('/manager/')) return 'manager';
        return 'admin';
    };

    const userRole = getUserRole();
    const canManageNews = userRole === 'admin' || userRole === 'reporter';

    useEffect(() => {
        const loadNews = async () => {
            if (showCrudMode) {
                fetchAllNews();
            } else {
                setLoading(true);
                const data = await getAllNewsLegacy();
                setNews(data);
                setLoading(false);
            }
        };

        loadNews();
    }, [showCrudMode, fetchAllNews]);

    const handleCreateNews = async (newsData: ICreateNewsRequest) => {
        const success = await createNewNews(newsData);
        if (success) {
            setShowForm(false);
            return true;
        }
        return false;
    };

    const handleUpdateNews = async (newsData: ICreateNewsRequest) => {
        if (!editingNews) return false;

        const success = await updateExistingNews(editingNews._id, newsData);
        if (success) {
            setEditingNews(null);
            setShowForm(false);
            return true;
        }
        return false;
    };

    const handleEditNews = (news: INewsResponse) => {
        setEditingNews(news);
        setShowForm(true);
    };

    const handleDeleteNews = (id: string) => {
        setDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        const success = await deleteExistingNews(deleteConfirm);
        if (success) {
            setDeleteConfirm(null);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingNews(null);
        clearError();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading && !showCrudMode) {
        return <LoadingState />;
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="bg-transparent rounded-[24px] sm:rounded-[36px] border border-black/10 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <NewsHeader />
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {canManageNews && (
                            <>
                                <Button
                                    variant={
                                        showCrudMode ? 'secondary' : 'primary'
                                    }
                                    onClick={() =>
                                        setShowCrudMode(!showCrudMode)
                                    }
                                    className="w-full sm:w-auto text-sm sm:text-base"
                                >
                                    {showCrudMode ? 'View Mode' : 'Manage Mode'}
                                </Button>
                                {showCrudMode && !showForm && (
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowForm(true)}
                                        className="w-full sm:w-auto text-sm sm:text-base"
                                    >
                                        Create Article
                                    </Button>
                                )}
                            </>
                        )}
                        {!canManageNews && userRole === 'manager' && (
                            <div className="text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-2 bg-gray-100 rounded-[12px] text-center">
                                Read-only access
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-transparent rounded-[16px] sm:rounded-[20px] border border-red-200 p-3 sm:p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                            </div>
                            <div className="ml-2 sm:ml-3">
                                <h3 className="text-xs sm:text-sm font-medium text-red-800">
                                    Error
                                </h3>
                                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-3 sm:mt-4">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={clearError}
                                        className="text-xs sm:text-sm"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showCrudMode ? (
                    <div className="space-y-6">
                        {showForm && canManageNews && (
                            <NewsForm
                                news={editingNews}
                                onSubmit={
                                    editingNews
                                        ? handleUpdateNews
                                        : handleCreateNews
                                }
                                onCancel={handleCancel}
                                isLoading={crudLoading}
                            />
                        )}

                        {crudLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="border-b pb-4"
                                    >
                                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : crudNews.length === 0 ? (
                            <div className="bg-transparent rounded-[16px] sm:rounded-[20px] border border-black/10 p-8 sm:p-12 text-center">
                                <p className="text-gray-500 text-base sm:text-lg">
                                    No news found
                                </p>
                                {canManageNews && (
                                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                                        Create your first news article
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                                {crudNews.map((article, index) => (
                                    <div
                                        key={article._id || index}
                                        className="bg-transparent rounded-[16px] sm:rounded-[20px] border border-black/10 p-4 sm:p-6"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg sm:text-xl font-semibold mb-2 break-words">
                                                    {article.title}
                                                </h3>

                                                <p className="text-gray-600 mb-3 text-sm sm:text-base break-words">
                                                    {truncateText(
                                                        article.body,
                                                        200,
                                                    )}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                                                    <span className="break-words">
                                                        {article.author}
                                                    </span>
                                                    {article.date && (
                                                        <>
                                                            <span className="hidden sm:inline">
                                                                •
                                                            </span>
                                                            <span className="break-words">
                                                                {formatDate(
                                                                    article.date,
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {canManageNews && (
                                                <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                                                    <Button
                                                        variant="secondary"
                                                        className="flex-1 lg:flex-none rounded-[16px] sm:rounded-[20px] text-sm sm:text-base"
                                                        onClick={() =>
                                                            handleEditNews(
                                                                article,
                                                            )
                                                        }
                                                        disabled={crudLoading}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        variant="primary"
                                                        className="flex-1 lg:flex-none rounded-[16px] sm:rounded-[20px] text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white"
                                                        onClick={() =>
                                                            handleDeleteNews(
                                                                article._id,
                                                            )
                                                        }
                                                        disabled={crudLoading}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}

                                            {!canManageNews && (
                                                <div className="flex flex-col gap-2 lg:min-w-[120px]">
                                                    <div className="text-xs text-gray-400 text-center py-2">
                                                        Read-only
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <NewsGrid news={news} />
                        <LoadMoreButton />
                    </>
                )}

                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-transparent rounded-[16px] sm:rounded-[20px] border border-black/10 p-4 sm:p-6 max-w-md w-full backdrop-blur-sm bg-white/90">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Confirm Delete
                            </h3>
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                Are you sure you want to delete this news
                                article? This action cannot be undone.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="w-full sm:w-auto text-sm sm:text-base"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={confirmDelete}
                                    disabled={crudLoading}
                                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                                >
                                    {crudLoading ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

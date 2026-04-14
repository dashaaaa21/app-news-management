import React from 'react';
import { Button } from '../ui/buttons/Button';
import EditIcon from '../icons/EditIcon';
import XIcon from '../icons/XIcon';
import type { INewsResponse } from '../../common/types/news-type';

interface INewsListProps {
    news: INewsResponse[];
    onEdit: (news: INewsResponse) => void;
    onDelete: (id: string) => void;
    isLoading: boolean;
}

export const NewsList: React.FC<INewsListProps> = ({
    news,
    onEdit,
    onDelete,
    isLoading,
}) => {
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

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="border-b pb-4">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500 text-lg">No news found</p>
                <p className="text-gray-400 text-sm mt-2">
                    Create your first news article
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">
                    News Articles ({news.length})
                </h2>
            </div>

            <div className="divide-y">
                {news.map((article) => (
                    <div
                        key={article._id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {article.title}
                                </h3>

                                <p className="text-gray-600 mb-3">
                                    {truncateText(article.body, 200)}
                                </p>

                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <span className="flex items-center">
                                        <strong>Author:</strong>{' '}
                                        {article.author}
                                    </span>
                                    {article.date && (
                                        <span className="flex items-center">
                                            <strong>Published:</strong>{' '}
                                            {formatDate(article.date)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                                <Button
                                    onClick={() => onEdit(article)}
                                    disabled={isLoading}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Edit news"
                                >
                                    <EditIcon className="w-4 h-4" />
                                </Button>

                                <Button
                                    onClick={() => onDelete(article._id)}
                                    disabled={isLoading}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete news"
                                >
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

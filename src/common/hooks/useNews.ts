import { useState, useCallback } from 'react';
import {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
} from '../../api/api-news/api-news';
import type {
    ICreateNewsRequest,
    IUpdateNewsRequest,
    INewsResponse,
    IUseNewsReturn,
} from '../types/news-type';

export const useNews = (): IUseNewsReturn => {
    const [news, setNews] = useState<INewsResponse[]>([]);
    const [currentNews, setCurrentNews] = useState<INewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllNews = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getAllNews();
            if (result.response) {
                setNews(result.response);
            } else if (result.error) {
                setError(result.error.message);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch news',
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchNewsById = useCallback(async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getNewsById(id);
            if (result.response) {
                setCurrentNews(result.response);
            } else if (result.error) {
                setError(result.error.message);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch news',
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createNewNews = useCallback(
        async (newsData: ICreateNewsRequest): Promise<boolean> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await createNews(newsData);
                if (result.response) {
                    await fetchAllNews();
                    return true;
                } else if (result.error) {
                    setError(result.error.message);
                    return false;
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to create news',
                );
            } finally {
                setIsLoading(false);
            }
            return false;
        },
        [fetchAllNews],
    );

    const updateExistingNews = useCallback(
        async (id: string, newsData: IUpdateNewsRequest): Promise<boolean> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await updateNews(id, newsData);
                if (result.response) {
                    await fetchAllNews();
                    return true;
                } else if (result.error) {
                    setError(result.error.message);
                    return false;
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to update news',
                );
            } finally {
                setIsLoading(false);
            }
            return false;
        },
        [fetchAllNews],
    );

    const deleteExistingNews = useCallback(
        async (id: string): Promise<boolean> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await deleteNews(id);
                if (result.response) {
                    await fetchAllNews();
                    return true;
                } else if (result.error) {
                    setError(result.error.message);
                    return false;
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to delete news',
                );
            } finally {
                setIsLoading(false);
            }
            return false;
        },
        [fetchAllNews],
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        news,
        currentNews,
        isLoading,
        error,
        fetchAllNews,
        fetchNewsById,
        createNewNews,
        updateExistingNews,
        deleteExistingNews,
        clearError,
    };
};

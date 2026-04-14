import { useState, useEffect } from 'react';

interface ContentItem {
    id: string;
    title: string;
    body: string;
    author?: string;
    createdAt: string;
    updatedAt?: string;
}

const STORAGE_KEY = 'news_content_storage';

export const useContentStorage = () => {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setItems(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error('Error loading content:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveToStorage = (newItems: ContentItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };

    const addContent = (
        title: string,
        body: string,
        author?: string,
    ): string => {
        const newItem: ContentItem = {
            id: Date.now().toString(),
            title,
            body,
            author,
            createdAt: new Date().toISOString(),
        };

        const updatedItems = [newItem, ...items];
        setItems(updatedItems);
        saveToStorage(updatedItems);

        return newItem.id;
    };

    const updateContent = (
        id: string,
        updates: Partial<Omit<ContentItem, 'id' | 'createdAt'>>,
    ) => {
        const updatedItems = items.map((item) =>
            item.id === id
                ? {
                      ...item,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                  }
                : item,
        );

        setItems(updatedItems);
        saveToStorage(updatedItems);
    };

    const getContentById = (id: string): ContentItem | undefined => {
        return items.find((item) => item.id === id);
    };

    const deleteContent = (id: string) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
        saveToStorage(updatedItems);
    };

    const clearAll = () => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        items,
        loading,
        addContent,
        updateContent,
        getContentById,
        deleteContent,
        clearAll,
    };
};

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../ui/buttons/Button';
import type {
    ICreateNewsRequest,
    INewsFormProps,
} from '../../common/types/news-type';

export const NewsForm: React.FC<INewsFormProps> = ({
    news,
    onSubmit,
    onCancel,
    isLoading,
}) => {
    const initialFormData = useMemo((): ICreateNewsRequest => {
        if (news) {
            return {
                title: news.title,
                body: news.body,
                author: news.author,
            };
        }
        return {
            title: '',
            body: '',
            author: '',
        };
    }, [news]);

    const [formData, setFormData] =
        useState<ICreateNewsRequest>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!formData.body.trim()) {
            newErrors.body = 'Body is required';
        } else if (formData.body.trim().length < 20) {
            newErrors.body = 'Body must be at least 20 characters';
        }

        if (!formData.author.trim()) {
            newErrors.author = 'Author is required';
        } else if (formData.author.trim().length < 2) {
            newErrors.author = 'Author must be at least 2 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const success = await onSubmit(formData);
        if (success) {
            setFormData({ title: '', body: '', author: '' });
            setErrors({});
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="bg-transparent rounded-[16px] sm:rounded-[20px] border border-black/10 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                {news ? 'Edit News' : 'Create New News'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] text-sm sm:text-base ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter news title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="author"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                        Author
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] text-sm sm:text-base ${
                            errors.author ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter author name"
                    />
                    {errors.author && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                            {errors.author}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="body"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                        Content
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        value={formData.body}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        rows={6}
                        className={`w-full px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] resize-vertical text-sm sm:text-base ${
                            errors.body ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter news content"
                    />
                    {errors.body && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                            {errors.body}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="w-full sm:w-auto text-sm sm:text-base"
                    >
                        {isLoading
                            ? 'Saving...'
                            : news
                              ? 'Update News'
                              : 'Create News'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="w-full sm:w-auto text-sm sm:text-base"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

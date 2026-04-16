import React, { useState, useMemo } from 'react';
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
                title: news.title || '',
                body: news.body || '',
                author: news.author || '',
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
    const [photoPreview, setPhotoPreview] = useState<string>(news?.image || '');
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!formData.body.trim()) {
            newErrors.body = 'Content is required';
        } else if (formData.body.trim().length < 20) {
            newErrors.body = 'Content must be at least 20 characters';
        }

        if (!formData.author.trim()) {
            newErrors.author = 'Author is required';
        } else if (formData.author.trim().length < 2) {
            newErrors.author = 'Author must be at least 2 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    photo: 'Photo size must be less than 5MB',
                }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                setErrors((prev) => ({
                    ...prev,
                    photo: 'Please select a valid image file',
                }));
                return;
            }

            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.photo;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const dataToSubmit: ICreateNewsRequest = {
            ...formData,
            image: photoFile || undefined,
        };

        const success = await onSubmit(dataToSubmit);
        if (success) {
            setFormData({ title: '', body: '', author: '' });
            setPhotoPreview('');
            setPhotoFile(null);
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
        <div className="bg-white rounded-[20px] border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">
                {news ? 'Edit Article' : 'Create New Article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
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
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter article title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700 mb-2"
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
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] ${
                            errors.author ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter author name"
                    />
                    {errors.author && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.author}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Article Photo
                    </label>
                    <div className="space-y-3">
                        {photoPreview && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhotoPreview('');
                                        setPhotoFile(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    Click to upload photo
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                disabled={isLoading}
                                className="hidden"
                            />
                        </label>
                        {errors.photo && (
                            <p className="text-red-500 text-sm">
                                {errors.photo}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="body"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Content
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        value={formData.body}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        rows={8}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] resize-vertical ${
                            errors.body ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter article content (plain text only)"
                    />
                    {errors.body && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.body}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="rounded-[20px]"
                    >
                        {isLoading
                            ? 'Saving...'
                            : news
                              ? 'Update Article'
                              : 'Create Article'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-[20px]"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

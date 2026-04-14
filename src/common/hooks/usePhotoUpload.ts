import { useState } from 'react';
import { uploadProfilePhoto } from '../../api/api-user/api-user';
import { getServerUrl } from '../utils/apiConfig';
import type { IUsePhotoUploadReturn } from '../types/hook-types';

export const usePhotoUpload = (): IUsePhotoUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): void => {
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error(
                'Please select a valid image file (JPEG, PNG, or WebP)',
            );
        }

        if (file.size > maxSize) {
            throw new Error('File size must be less than 5MB');
        }
    };

    const uploadPhoto = async (file: File): Promise<string> => {
        setIsUploading(true);
        setError(null);

        try {
            validateFile(file);
            const response = await uploadProfilePhoto(file);

            return response.url.startsWith('http')
                ? response.url
                : getServerUrl(response.url);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        uploadPhoto,
        isUploading,
        error,
        clearError,
    };
};

import { useState } from 'react';
import { updateProfileService } from '../../api/api-user/api-user';
import { getAccessToken } from '../../common/utils/localStorage';
import type { IProfileData } from '../types/user-type';
import type { IUseUpdateProfileReturn } from '../types/hook-types';

export const useUpdateProfile = (): IUseUpdateProfileReturn => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (data: IProfileData): Promise<void> => {
        setIsUpdating(true);
        setError(null);

        try {
            const token = getAccessToken();
            if (!token) {
                throw new Error('No access token found');
            }

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;

            await updateProfileService({
                id: userId,
                ...data,
            });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Update failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        updateProfile,
        isUpdating,
        error,
        clearError,
    };
};

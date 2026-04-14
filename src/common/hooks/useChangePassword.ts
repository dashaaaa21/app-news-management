import { useState } from 'react';
import { changePasswordService } from '../../api/api-user/api-user';
import type { IUseChangePasswordReturn } from '../types/hook-types';

export const useChangePassword = (): IUseChangePasswordReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changePassword = async (
        currentPassword: string,
        newPassword: string,
        confirmNewPassword: string,
    ): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;

            await changePasswordService({
                userId,
                currentPassword,
                newPassword,
                confirmNewPassword,
            });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        changePassword,
        isLoading,
        error,
        clearError,
    };
};

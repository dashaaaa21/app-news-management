import type { IChangePasswordFormData } from '../types/user-type';

export const validateChangePasswordForm = (
    formData: IChangePasswordFormData,
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
        errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmNewPassword) {
        errors.confirmNewPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
    }

    return errors;
};

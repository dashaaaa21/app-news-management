import type { IForgotPasswordFormData } from '../types/user-type';

export const validateForgotPasswordForm = (
    formData: IForgotPasswordFormData,
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/@/.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 100) {
        errors.email = 'Email must not exceed 100 characters';
    }

    return errors;
};

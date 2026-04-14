import type { ILoginFormData } from '../types/user-type';

export const validateLoginForm = (
    formData: ILoginFormData,
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/@/.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
};

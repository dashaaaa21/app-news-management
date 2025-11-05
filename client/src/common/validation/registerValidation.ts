import type { IRegisterFormData } from '../types/user-type';

export const validateRegisterForm = (
    formData: IRegisterFormData,
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.trim().length > 50) {
        errors.firstName = 'First name must not exceed 50 characters';
    } else if (!/[a-z]/i.test(formData.firstName.trim())) {
        errors.firstName = 'First name can only contain letters and spaces';
    }

    if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.trim().length > 50) {
        errors.lastName = 'Last name must not exceed 50 characters';
    } else if (!/[a-z]/i.test(formData.lastName.trim())) {
        errors.lastName = 'Last name can only contain letters and spaces';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/@/.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 100) {
        errors.email = 'Email must not exceed 100 characters';
    }

    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password =
            'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && formData.phone.trim()) {
        if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
    }

    if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (birthDate > today) {
            errors.dateOfBirth = 'Date of birth cannot be in the future';
        } else if (age < 13) {
            errors.dateOfBirth = 'You must be at least 13 years old';
        } else if (age > 120) {
            errors.dateOfBirth = 'Please enter a valid date of birth';
        }
    }

    return errors;
};

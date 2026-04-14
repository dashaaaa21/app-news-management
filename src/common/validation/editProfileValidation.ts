import type { IEditProfileFormData } from '../types/user-type';

export const validateEditProfileForm = (
    formData: IEditProfileFormData,
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

    if (!formData.gender) {
        errors.gender = 'Gender is required';
    }

    if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
    } else {
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

    if (!formData.position.trim()) {
        errors.position = 'Position is required';
    } else if (formData.position.trim().length < 2) {
        errors.position = 'Position must be at least 2 characters';
    } else if (formData.position.trim().length > 100) {
        errors.position = 'Position must not exceed 100 characters';
    }

    if (!formData.hireDate) {
        errors.hireDate = 'Hire date is required';
    } else {
        const hireDate = new Date(formData.hireDate);
        const today = new Date();
        const birthDate = new Date(formData.dateOfBirth);

        if (hireDate > today) {
            errors.hireDate = 'Hire date cannot be in the future';
        } else if (formData.dateOfBirth && hireDate < birthDate) {
            errors.hireDate = 'Hire date cannot be before date of birth';
        }
    }

    if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio.trim().length > 500) {
        errors.bio = 'Bio must not exceed 500 characters';
    }

    if (!formData.role) {
        errors.role = 'Role is required';
    }

    return errors;
};

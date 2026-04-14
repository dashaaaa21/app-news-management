import type { IProfileData } from '../types/user-type';

const PROFILE_STORAGE_KEY = 'userProfile';

export const saveProfileToStorage = (profile: IProfileData): void => {
    try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
        // Ignore storage errors
    }
};

export const getProfileFromStorage = (): IProfileData | null => {
    try {
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const clearProfileFromStorage = (): void => {
    try {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch {
        // Ignore storage errors
    }
};

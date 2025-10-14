import type { IProfileData } from './user-type';

export interface IUsePhotoUploadReturn {
    uploadPhoto: (file: File) => Promise<string>;
    isUploading: boolean;
    error: string | null;
    clearError: () => void;
}

export interface IUseChangePasswordReturn {
    changePassword: (
        currentPassword: string,
        newPassword: string,
        confirmNewPassword: string,
    ) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export interface IUseUpdateProfileReturn {
    updateProfile: (data: IProfileData) => Promise<void>;
    isUpdating: boolean;
    error: string | null;
    clearError: () => void;
}

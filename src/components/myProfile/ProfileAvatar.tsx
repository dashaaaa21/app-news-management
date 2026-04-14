import React, { useRef, useState } from 'react';
import { usePhotoUpload } from '../../common/hooks/usePhotoUpload';
import {
    saveProfileToStorage,
    getProfileFromStorage,
} from '../../common/utils/profileStorage';
import type { IProfileAvatarProps } from '../../common/types/component-types';

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({
    currentPhoto,
    onPhotoChange,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const { uploadPhoto, isUploading, error, clearError } = usePhotoUpload();

    const handleFileSelect = () => {
        fileInputRef.current?.click();
        clearError();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setPreviewUrl(result);
            setImageError(false);

            onPhotoChange?.(result);

            const storedProfile = getProfileFromStorage();
            if (storedProfile) {
                saveProfileToStorage({
                    ...storedProfile,
                    profilePicture: result,
                });
            }
        };
        reader.readAsDataURL(file);

        try {
            const photoUrl = await uploadPhoto(file);
            onPhotoChange?.(photoUrl);

            const storedProfile = getProfileFromStorage();
            if (storedProfile) {
                saveProfileToStorage({
                    ...storedProfile,
                    profilePicture: photoUrl,
                });
            }
        } catch {}
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    const displayPhoto = previewUrl || currentPhoto;
    const isLocalImage = displayPhoto?.startsWith('data:');
    const hasPhoto = displayPhoto && (isLocalImage || !imageError);

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] lg:w-[250px] lg:h-[250px] rounded-[20px] sm:rounded-[22px] lg:rounded-[24px] bg-[#D9D9D9] flex items-center justify-center relative group cursor-pointer hover:bg-[#C9C9C9] transition-all border-2 border-gray-200"
                onClick={handleFileSelect}
            >
                {hasPhoto ? (
                    <div className="w-full h-full relative">
                        <img
                            src={displayPhoto}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-[18px] sm:rounded-[20px] lg:rounded-[22px]"
                            onError={
                                isLocalImage ? undefined : handleImageError
                            }
                            onLoad={handleImageLoad}
                        />
                        <div className="absolute top-2 right-2">
                            <button
                                type="button"
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D7FF82] flex items-center justify-center text-sm font-bold hover:bg-[#cbf475] transition-all shadow-md"
                            >
                                ✎
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D7FF82] flex items-center justify-center text-xl sm:text-2xl font-bold hover:bg-[#cbf475] transition-all"
                            disabled={isUploading}
                        >
                            {isUploading ? '...' : '+'}
                        </button>
                        <p className="text-xs text-gray-500 text-center px-2">
                            Click to upload photo
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="text-red-500 text-sm text-center max-w-[200px] sm:max-w-[220px] lg:max-w-[250px] px-2">
                    {error}
                </p>
            )}

            {imageError && currentPhoto && !isLocalImage && (
                <p className="text-red-500 text-sm text-center max-w-[200px] sm:max-w-[220px] lg:max-w-[250px] px-2">
                    Failed to load image
                </p>
            )}

            {isUploading && (
                <p className="text-gray-500 text-sm">Uploading...</p>
            )}
        </div>
    );
};

export default ProfileAvatar;

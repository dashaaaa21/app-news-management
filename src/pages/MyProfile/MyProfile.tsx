import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../../components/myProfile/ProfileHeader';
import ProfileFormFields from '../../components/myProfile/ProfileFormFields';
import ProfileFormActions from '../../components/myProfile/ProfileFormActions';
import ProfileAvatarSection from '../../components/myProfile/ProfileAvatarSection';
import { validateEditProfileForm } from '../../common/validation/editProfileValidation';
import { useUpdateProfile } from '../../common/hooks/useUpdateProfile';
import { getAccessToken } from '../../common/utils/localStorage';
import {
    saveProfileToStorage,
    getProfileFromStorage,
} from '../../common/utils/profileStorage';
import { getServerUrl } from '../../common/utils/apiConfig';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const {
        updateProfile,
        isUpdating,
        error: updateError,
    } = useUpdateProfile();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'female' as 'male' | 'female' | 'other',
        dateOfBirth: '',
        position: '',
        hireDate: '',
        phone: '',
        bio: '',
        role: 'user' as 'admin' | 'user' | 'manager',
    });
    const [profilePhoto, setProfilePhoto] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = () => {
            try {
                const storedProfile = getProfileFromStorage();

                if (storedProfile) {
                    setFormData({
                        firstName: storedProfile.firstName || '',
                        lastName: storedProfile.lastName || '',
                        email: storedProfile.email || '',
                        gender:
                            (storedProfile.gender as
                                | 'male'
                                | 'female'
                                | 'other') || 'female',
                        dateOfBirth: storedProfile.dateOfBirth
                            ? storedProfile.dateOfBirth.split('T')[0]
                            : '',
                        position: storedProfile.position || '',
                        hireDate: storedProfile.hireDate
                            ? storedProfile.hireDate.split('T')[0]
                            : '',
                        phone: storedProfile.phone || '',
                        bio: storedProfile.bio || '',
                        role:
                            (storedProfile.role?.toLowerCase() as
                                | 'admin'
                                | 'user'
                                | 'manager') || 'user',
                    });

                    if (storedProfile.profilePicture) {
                        setProfilePhoto(storedProfile.profilePicture);
                    }
                } else {
                    const token = getAccessToken();
                    if (token) {
                        const payload = JSON.parse(atob(token.split('.')[1]));

                        const profileData = {
                            firstName: payload.firstName || '',
                            lastName: payload.lastName || '',
                            email: payload.email || '',
                            gender: payload.gender || 'female',
                            dateOfBirth: payload.dateOfBirth
                                ? payload.dateOfBirth.split('T')[0]
                                : '',
                            position: payload.position || '',
                            hireDate: payload.hireDate
                                ? payload.hireDate.split('T')[0]
                                : '',
                            phone: payload.phone || '',
                            bio: payload.bio || '',
                            role: payload.role?.toLowerCase() || 'user',
                            profilePicture: payload.profilePicture
                                ? getServerUrl(payload.profilePicture)
                                : '',
                        };

                        setFormData({
                            firstName: profileData.firstName,
                            lastName: profileData.lastName,
                            email: profileData.email,
                            gender: profileData.gender as
                                | 'male'
                                | 'female'
                                | 'other',
                            dateOfBirth: profileData.dateOfBirth,
                            position: profileData.position,
                            hireDate: profileData.hireDate,
                            phone: profileData.phone,
                            bio: profileData.bio,
                            role: profileData.role as
                                | 'admin'
                                | 'user'
                                | 'manager',
                        });

                        if (profileData.profilePicture) {
                            setProfilePhoto(profileData.profilePicture);
                        }

                        saveProfileToStorage(profileData);
                    }
                }
            } catch {
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handlePhotoChange = (photoUrl: string) => {
        setProfilePhoto(photoUrl);
    };

    const handleSave = async () => {
        const validationErrors = validateEditProfileForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await updateProfile(formData);

            const updatedProfile = {
                ...formData,
                profilePicture: profilePhoto,
            };

            saveProfileToStorage(updatedProfile);

            alert('Profile updated successfully!');
        } catch {
            setErrors({
                general: updateError || 'Failed to update profile',
            });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
                <div className="text-base sm:text-lg">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="border-2 border-gray-200 rounded-[24px] p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
                <ProfileHeader />

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm mb-6">
                        {errors.general}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="flex-1 order-2 lg:order-1">
                        <ProfileFormFields
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                        />
                        <div className="block lg:hidden mt-6">
                            <ProfileFormActions
                                onSave={handleSave}
                                isLoading={isUpdating}
                            />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center lg:block">
                        <ProfileAvatarSection
                            currentPhoto={profilePhoto}
                            onPhotoChange={handlePhotoChange}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>

                <div className="hidden lg:block">
                    <ProfileFormActions
                        onSave={handleSave}
                        isLoading={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

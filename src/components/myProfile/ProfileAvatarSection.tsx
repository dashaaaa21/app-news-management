import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileAvatarActions from './ProfileAvatarActions';
import ChangePasswordLink from './ChangePasswordLink';
import type { IProfileAvatarSectionProps } from '../../common/types/component-types';

const ProfileAvatarSection: React.FC<IProfileAvatarSectionProps> = ({
    currentPhoto,
    onPhotoChange,
    onSave,
    onCancel,
}) => {
    return (
        <div className="flex flex-col items-center gap-4 lg:sticky lg:top-8">
            <ProfileAvatar
                currentPhoto={currentPhoto}
                onPhotoChange={onPhotoChange}
            />
            <div className="hidden lg:block">
                <ProfileAvatarActions onSave={onSave} onCancel={onCancel} />
            </div>
            <ChangePasswordLink />
        </div>
    );
};

export default ProfileAvatarSection;

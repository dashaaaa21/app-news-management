import React from 'react';
import ChangePasswordLink from './ChangePasswordLink';

const ProfileHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold">My profile</h1>
            <ChangePasswordLink />
        </div>
    );
};

export default ProfileHeader;

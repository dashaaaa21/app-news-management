import React from 'react';
import type { IProfileAvatarActionsProps } from '../../common/types/component-types';

const ProfileAvatarActions: React.FC<IProfileAvatarActionsProps> = ({
    onSave,
    onCancel,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <button
                onClick={onSave}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-[#D7FF82] hover:bg-[#cbf475] text-black font-bold rounded-[16px] transition-all text-sm sm:text-base"
            >
                Save
            </button>
            <button
                onClick={onCancel}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 text-gray-600 hover:text-gray-900 font-medium transition-all border border-gray-300 rounded-[16px] hover:border-gray-400 text-sm sm:text-base"
            >
                Cancel
            </button>
        </div>
    );
};

export default ProfileAvatarActions;

import React from 'react';

interface ProfileFormActionsProps {
    onSave: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const ProfileFormActions: React.FC<ProfileFormActionsProps> = ({
    onSave,
    onCancel,
    isLoading = false,
}) => {
    return (
        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button
                onClick={onSave}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-[#D7FF82] hover:bg-[#cbf475] text-black font-bold rounded-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
                {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            {onCancel && (
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                    Cancel
                </button>
            )}
        </div>
    );
};

export default ProfileFormActions;

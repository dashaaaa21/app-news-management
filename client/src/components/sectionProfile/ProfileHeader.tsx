import { useState } from 'react';
import { deleteUser } from '../../api/api-user/api-user';
import { getUserRole } from '../../common/utils/localStorage';
import DotsVerticalIcon from '../icons/DotsVerticalIcon';

interface ProfileHeaderProps {
    selectedUsers: number[];
    onClearSelection: () => void;
    onRefresh: () => void;
    isManager?: boolean;
}

export default function ProfileHeader({
    selectedUsers,
    onClearSelection,
    onRefresh,
    isManager = false,
}: ProfileHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userRole = getUserRole();
    const isAdmin = userRole === 'administrator';

    const handleDelete = async () => {
        if (selectedUsers.length === 0) {
            alert('Please select users to delete');
            setIsMenuOpen(false);
            return;
        }

        if (
            confirm(
                `Are you sure you want to delete ${selectedUsers.length} user(s)?`,
            )
        ) {
            try {
                for (const userId of selectedUsers) {
                    await deleteUser(userId.toString());
                }
                onClearSelection();
                onRefresh();
            } catch {
                alert('Error deleting users');
            }
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="p-5 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
                <p className="text-lg font-semibold">Our Profiles</p>
                {selectedUsers.length > 0 && !isManager && (
                    <span className="text-sm text-gray-600">
                        ({selectedUsers.length} selected)
                    </span>
                )}
            </div>
            {!isManager && isAdmin && (
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="bg-black/10 p-3 rounded-[20px] hover:bg-black/20 transition-colors"
                    >
                        <DotsVerticalIcon />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Delete Selected
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

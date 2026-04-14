import { useState } from 'react';
import { useGetUsers } from '../../common/hooks/useUsersCrud';
import { getUserRole } from '../../common/utils/localStorage';
import type { IUser } from '../../common/types/user-type';
import UsersTableHeader from './UsersTableHeader';
import UserTableRow from './UserTableRow';
import ViewUserModal from './ViewUserModal';
import LoadingState from './LoadingState';

interface UsersTableProps {
    selectedUsers: number[];
    onSelectedUsersChange: (users: number[]) => void;
    isManager?: boolean;
}

export default function UsersTable({
    selectedUsers,
    onSelectedUsersChange,
    isManager = false,
}: UsersTableProps) {
    const { data: users = [], isLoading, refetch } = useGetUsers();
    const userRole = getUserRole();
    const isAdmin = userRole === 'administrator';
    const [selectedUserForModal, setSelectedUserForModal] =
        useState<IUser | null>(null);

    const handleSelectUser = (userId: number) => {
        onSelectedUsersChange(
            selectedUsers.includes(userId)
                ? selectedUsers.filter((id) => id !== userId)
                : [...selectedUsers, userId],
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            onSelectedUsersChange([]);
        } else {
            onSelectedUsersChange(users.map((user) => user.id));
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <>
            <div className="px-6 pb-4">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <UsersTableHeader
                            isAllSelected={
                                selectedUsers.length === users.length &&
                                users.length > 0
                            }
                            onSelectAll={handleSelectAll}
                            isManager={isManager || !isAdmin}
                        />
                        <tbody>
                            {users.map((user, index) => (
                                <UserTableRow
                                    key={`${(user as any)._id || user.id}-${index}`}
                                    user={user}
                                    isSelected={selectedUsers.includes(user.id)}
                                    onSelect={handleSelectUser}
                                    onViewUser={setSelectedUserForModal}
                                    isManager={isManager || !isAdmin}
                                    onUserDeleted={handleRefresh}
                                    showEditDelete={isAdmin}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUserForModal && (
                <ViewUserModal
                    user={selectedUserForModal}
                    onClose={() => setSelectedUserForModal(null)}
                    onUserDeleted={handleRefresh}
                />
            )}
        </>
    );
}

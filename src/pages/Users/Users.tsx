import { useState } from 'react';
import ProfileHeader from '../../components/sectionProfile/ProfileHeader';
import AddNewButton from '../../components/sectionProfile/AddNewButton';
import UsersTable from '../../components/sectionProfile/UsersTable';

export default function Users() {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="p-8">
            <div className="bg-transparent rounded-[36px] border border-black/10">
                <ProfileHeader
                    selectedUsers={selectedUsers}
                    onClearSelection={() => setSelectedUsers([])}
                    onRefresh={handleRefresh}
                />
                <AddNewButton />
                <UsersTable
                    selectedUsers={selectedUsers}
                    onSelectedUsersChange={setSelectedUsers}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
}

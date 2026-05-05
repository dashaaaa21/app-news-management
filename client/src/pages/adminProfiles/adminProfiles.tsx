import { useState } from 'react';
import ProfileHeader from '../../components/sectionProfile/ProfileHeader';
import AddNewButton from '../../components/sectionProfile/AddNewButton';
import UsersTable from '../../components/sectionProfile/UsersTable';

export default function AdminProfiles() {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    return (
        <div className="p-8">
            <div className="bg-transparent rounded-[36px] border border-black/10">
                <ProfileHeader
                    selectedUsers={selectedUsers}
                    onClearSelection={() => setSelectedUsers([])}
                    onRefresh={() => {}}
                />
                <AddNewButton />
                <UsersTable
                    selectedUsers={selectedUsers}
                    onSelectedUsersChange={setSelectedUsers}
                />
            </div>
        </div>
    );
}

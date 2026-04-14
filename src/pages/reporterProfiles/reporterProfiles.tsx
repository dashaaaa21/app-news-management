import ProfileHeader from '../../components/sectionProfile/ProfileHeader';
import UsersTable from '../../components/sectionProfile/UsersTable';

export default function ReporterProfiles() {
    return (
        <div className="p-8">
            <div className="bg-transparent rounded-[36px] border border-black/10">
                <ProfileHeader
                    selectedUsers={[]}
                    onClearSelection={() => {}}
                    onRefresh={() => {}}
                    isManager={true}
                />
                <UsersTable
                    selectedUsers={[]}
                    onSelectedUsersChange={() => {}}
                    isManager={true}
                />
            </div>
        </div>
    );
}

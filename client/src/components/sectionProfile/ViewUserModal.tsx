import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../common/types/user-type';
import { useDeleteUser } from '../../common/hooks/useUsersCrud';
import { getUserRole } from '../../common/utils/localStorage';
import { Button } from '../ui/buttons/Button';
import Cross from '../icons/Cross';

interface ViewUserModalProps {
    user: IUser;
    onClose: () => void;
    onUserDeleted?: () => void;
}

export default function ViewUserModal({
    user,
    onClose,
    onUserDeleted,
}: ViewUserModalProps) {
    const navigate = useNavigate();
    const userRole = getUserRole();
    const isAdmin = userRole === 'administrator';
    const deleteUserMutation = useDeleteUser();

    const handleEdit = () => {
        const userId = (user as IUser & { _id?: string })._id || user.id;
        navigate(`/admin/user/edit/${userId}`);
        onClose();
    };

    const handleDelete = async () => {
        const userId = (user as IUser & { _id?: string })._id || user.id;
        if (
            window.confirm(
                `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
            )
        ) {
            try {
                await deleteUserMutation.mutateAsync(String(userId));
                onUserDeleted?.();
                onClose();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-[36px] w-full max-w-3xl overflow-hidden relative shadow-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                    >
                        <Cross />
                    </button>

                    <div className="bg-gradient-to-br from-[#CEFF7D] to-[#b8e66d] pt-8 pb-8 px-8">
                        <div className="flex flex-col items-center">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-lg text-gray-700 mt-1">
                                {user.position}
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Email
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                    {user.email}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Phone
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                    {user.phone}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Role
                                </p>
                                <p className="text-base font-medium text-gray-900 capitalize">
                                    {user.role}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Gender
                                </p>
                                <p className="text-base font-medium text-gray-900 capitalize">
                                    {user.gender}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 col-span-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Hire Date
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                    {new Date(user.hireDate)
                                        .toLocaleDateString('en-GB')
                                        .split('/')
                                        .join('.')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8 flex gap-3 justify-end">
                        {isAdmin && (
                            <>
                                <Button
                                    onClick={handleEdit}
                                    variant="primary"
                                    className="rounded-[20px]"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="primary"
                                    className="rounded-[20px] bg-red-500 hover:bg-red-600"
                                    disabled={deleteUserMutation.isPending}
                                >
                                    {deleteUserMutation.isPending
                                        ? 'Deleting...'
                                        : 'Delete'}
                                </Button>
                            </>
                        )}
                        <Button
                            onClick={onClose}
                            variant="secondary"
                            className="rounded-[20px]"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../common/types/user-type';
import { useDeleteUser } from '../../common/hooks/useUsersCrud';
import { Button } from '../ui/buttons/Button';

interface IUserTableRowProps {
    user: IUser;
    isSelected: boolean;
    onSelect: (userId: number) => void;
    onViewUser: (user: IUser) => void;
    isManager?: boolean;
    onUserDeleted?: () => void;
    showEditDelete?: boolean;
}

export default function UserTableRow({
    user,
    isSelected,
    onSelect,
    onViewUser,
    isManager = false,
    onUserDeleted,
    showEditDelete = false,
}: IUserTableRowProps) {
    const navigate = useNavigate();
    const deleteUserMutation = useDeleteUser();

    const handleEdit = () => {
        const userId = (user as any)._id || user.id;
        navigate(`/admin/user/edit/${userId}`);
    };

    const handleDelete = async () => {
        const userId = (user as any)._id || user.id;
        if (
            window.confirm(
                `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
            )
        ) {
            try {
                await deleteUserMutation.mutateAsync(userId.toString());
                onUserDeleted?.();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <tr
            className="border-b border-[#dededa] hover:bg-[#EFF5E9] transition-colors cursor-pointer"
            onClick={() => onViewUser(user)}
        >
            {!isManager && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                            onSelect(parseInt((user as any)._id || user.id))
                        }
                        className="w-4 h-4 cursor-pointer"
                    />
                </td>
            )}
            <td className="px-4 py-3 text-sm text-[#2d2d2d]">
                {user.firstName} {user.lastName}
            </td>
            <td className="px-4 py-3 text-sm text-[#2d2d2d]">{user.email}</td>
            <td className="px-4 py-3 text-sm text-[#2d2d2d]">
                {user.position}
            </td>
            <td className="px-4 py-3 text-sm text-[#2d2d2d]">{user.phone}</td>
            <td className="px-4 py-3 text-sm text-[#2d2d2d] capitalize">
                {user.role}
            </td>
            <td className="px-4 py-3 text-sm text-[#2d2d2d]">
                {new Date(user.hireDate).toLocaleDateString()}
            </td>
            <td className="px-4 py-3 text-right">
                <div
                    className="flex gap-2 justify-end flex-wrap"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        onClick={() => onViewUser(user)}
                        variant="secondary"
                        className="rounded-[20px] text-sm"
                    >
                        View
                    </Button>
                    {showEditDelete && (
                        <>
                            <Button
                                onClick={handleEdit}
                                variant="primary"
                                className="rounded-[20px] text-sm"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="primary"
                                className="rounded-[20px] text-sm bg-red-500 hover:bg-red-600"
                                disabled={deleteUserMutation.isPending}
                            >
                                {deleteUserMutation.isPending
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </Button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

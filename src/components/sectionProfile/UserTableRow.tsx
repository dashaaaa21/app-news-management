import { useNavigate } from 'react-router-dom';
import type { IUser } from '../../common/types/user-type';
import { getUserRole } from '../../common/utils/localStorage';
import { Button } from '../ui/buttons/Button';

interface IUserTableRowProps {
    user: IUser;
    isSelected: boolean;
    onSelect: (userId: number) => void;
    onViewUser: (user: IUser) => void;
    isManager?: boolean;
}

export default function UserTableRow({
    user,
    isSelected,
    onSelect,
    onViewUser,
    isManager = false,
}: IUserTableRowProps) {
    const navigate = useNavigate();
    const userRole = getUserRole();
    const isAdmin = userRole === 'admin';

    const handleEdit = () => {
        navigate(`/admin/user/edit/${user.id}`);
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
                        onChange={() => onSelect(user.id)}
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
                    className="flex gap-2 justify-end"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!isManager && isAdmin && (
                        <Button
                            onClick={handleEdit}
                            variant="primary"
                            className="rounded-[20px] text-base"
                        >
                            Edit
                        </Button>
                    )}
                    <Button
                        onClick={() => onViewUser(user)}
                        variant="secondary"
                        className="rounded-[20px] text-base"
                    >
                        View
                    </Button>
                </div>
            </td>
        </tr>
    );
}

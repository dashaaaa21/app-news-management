import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/buttons/Button';
import { adminPrivateRoutesVariables } from '../../router/routesVariables/pathVariables';
import { getUserRole } from '../../common/utils/localStorage';

export default function AddNewButton() {
    const navigate = useNavigate();
    const userRole = getUserRole();
    const isAdmin = userRole === 'administrator';

    if (!isAdmin) {
        return null;
    }

    const handleAddNew = () => {
        navigate(adminPrivateRoutesVariables.createUser);
    };

    return (
        <div className="px-6 flex justify-center py-4">
            <Button
                onClick={handleAddNew}
                variant="primary"
                className="rounded-[20px] text-base"
            >
                Add new +
            </Button>
        </div>
    );
}


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { IUserFormData } from '../../../common/types/user-type.ts';
import { getUserById, updateUserById } from '../../../api/api-user/api-user.ts';
import { adminPrivateRoutesVariables } from '../../../router/routesVariables/pathVariables';
import Breadcrumbs from '../../ui/Breadcrumbs/Breadcrumbs';
import UserFormHeader from '../../userForm/UserFormHeader.tsx';
import UserFormInputs from '../../userForm/UserFormInputs.tsx';
import UserFormActions from '../../userForm/UserFormActions.tsx';

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [formData, setFormData] = useState<IUserFormData>({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'male',
        dateOfBirth: '',
        position: '',
        hireDate: '',
        phone: '',
        role: 'user',
    });

    useEffect(() => {
        const loadUserData = async () => {
            if (id) {
                setLoading(true);
                const result = await getUserById(id);
                if (result.response) {
                    const user = result.response;
                    setUserName(`${user.firstName} ${user.lastName}`);
                    setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        gender: user.gender,
                        dateOfBirth: user.dateOfBirth,
                        position: user.position,
                        hireDate: user.hireDate,
                        phone: user.phone,
                        role: user.role,
                    });
                }
                setLoading(false);
            }
        };

        loadUserData();
    }, [id]);

    const handleSave = async () => {
        if (id) {
            try {
                const result = await updateUserById(id, formData);
                if (result.response) {
                    alert('User updated successfully!');
                    navigate(-1);
                } else if (result.error) {
                    alert('Error updating user: ' + result.error.message);
                }
            } catch (error) {
                alert('Error updating user');
                console.error(error);
            }
        }
    };

    const handleBack = () => {
        if (confirm('Are you sure you want to go back?')) {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="w-[600px] bg-transparent rounded-[36px] border border-black/10 p-8">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <Breadcrumbs
                items={[
                    {
                        label: 'Edits Profiles',
                        path: adminPrivateRoutesVariables.adminProfiles,
                    },
                    { label: userName },
                ]}
            />
            <div className="w-[600px] bg-transparent rounded-[36px] border border-black/10">
                <UserFormHeader />
                <UserFormInputs formData={formData} setFormData={setFormData} />
                <UserFormActions onSave={handleSave} onBack={handleBack} />
            </div>
        </div>
    );
}

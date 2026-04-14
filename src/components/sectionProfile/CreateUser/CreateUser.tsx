import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IUserFormData } from '../../../common/types/user-type';
import { createUser } from '../../../api/api-user/api-user';
import { adminPrivateRoutesVariables } from '../../../router/routesVariables/pathVariables';
import Breadcrumbs from '../../ui/Breadcrumbs/Breadcrumbs';
import UserFormHeader from '../../userForm/UserFormHeader';
import UserFormInputs from '../../userForm/UserFormInputs';
import UserFormActions from '../../userForm/UserFormActions';

export default function CreateUser() {
    const navigate = useNavigate();
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

    const handleSave = async () => {
        try {
            await createUser(formData);
            alert('User created successfully!');
            navigate(-1);
        } catch (error) {
            alert('Error creating user');
            console.error(error);
        }
    };

    const handleBack = () => {
        if (confirm('Are you sure you want to go back? ')) {
            navigate(-1);
        }
    };

    return (
        <div className="p-8">
            <Breadcrumbs
                items={[
                    {
                        label: 'Edits Profiles',
                        path: adminPrivateRoutesVariables.adminProfiles,
                    },
                    { label: 'New User' },
                ]}
            />
            <div className="w-[600px] bg-transparent rounded-[36px] border border-black/10">
                <UserFormHeader title="Create User" />
                <UserFormInputs formData={formData} setFormData={setFormData} />
                <UserFormActions onSave={handleSave} onBack={handleBack} />
            </div>
        </div>
    );
}

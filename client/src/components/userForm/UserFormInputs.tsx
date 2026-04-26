import type { IUserFormData } from '../../common/types/user-type';
import FormInput from './FormInput';

interface IUserFormInputsProps {
    formData: IUserFormData;
    setFormData: (data: IUserFormData) => void;
}

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'manager', label: 'Manager' },
];

export default function UserFormInputs({
    formData,
    setFormData,
}: IUserFormInputsProps) {
    return (
        <div className="flex flex-col px-10 gap-4 py-5">
            <div className="flex gap-16">
                <FormInput
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) =>
                        setFormData({ ...formData, firstName: value })
                    }
                    placeholder="First Name"
                />
                <FormInput
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) =>
                        setFormData({ ...formData, lastName: value })
                    }
                    placeholder="Last Name"
                />
            </div>
            <div className="flex gap-16">
                <FormInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) =>
                        setFormData({ ...formData, email: value })
                    }
                    placeholder="Email"
                />
                <FormInput
                    label="Gender"
                    type="select"
                    value={formData.gender}
                    onChange={(value) =>
                        setFormData({
                            ...formData,
                            gender: value as 'male' | 'female' | 'other',
                        })
                    }
                    placeholder="Select Gender"
                    options={genderOptions}
                />
            </div>
            <div className="flex gap-16">
                <FormInput
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(value) =>
                        setFormData({ ...formData, dateOfBirth: value })
                    }
                    placeholder="Date of Birth"
                />
                <FormInput
                    label="Position"
                    value={formData.position}
                    onChange={(value) =>
                        setFormData({ ...formData, position: value })
                    }
                    placeholder="Position"
                />
            </div>
            <div className="flex gap-16">
                <FormInput
                    label="Hire Date"
                    type="date"
                    value={formData.hireDate}
                    onChange={(value) =>
                        setFormData({ ...formData, hireDate: value })
                    }
                    placeholder="Hire Date"
                />
                <FormInput
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) =>
                        setFormData({ ...formData, phone: value })
                    }
                    placeholder="Phone"
                />
            </div>
            <div className="flex gap-16">
                <FormInput
                    label="Role"
                    type="select"
                    value={formData.role}
                    onChange={(value) =>
                        setFormData({
                            ...formData,
                            role: value as 'admin' | 'user' | 'manager',
                        })
                    }
                    placeholder="Select Role"
                    options={roleOptions}
                />
                <div className="w-[220px]"></div>
            </div>
        </div>
    );
}

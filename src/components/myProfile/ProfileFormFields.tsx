import React from 'react';
import ProfileFormInput from './ProfileFormInput';
import type { IProfileFormFieldsProps } from '../../common/types/component-types';

const ProfileFormFields: React.FC<IProfileFormFieldsProps> = ({
    formData,
    errors = {},
    onChange,
}) => {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ProfileFormInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                placeholder="First Name"
                error={errors.firstName}
            />
            <ProfileFormInput
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                placeholder="Last Name"
                error={errors.lastName}
            />
            <ProfileFormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email"
                error={errors.email}
            />
            <div>
                <label className="block text-sm text-gray-600 mb-2">
                    Gender
                </label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                    className={`w-full px-4 py-3 rounded-[16px] bg-white border outline-none transition-all shadow-sm text-gray-900 ${
                        errors.gender
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-300 focus:border-gray-400'
                    }`}
                >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
            </div>
            <ProfileFormInput
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={onChange}
                placeholder="Date of Birth"
                error={errors.dateOfBirth}
            />
            <ProfileFormInput
                label="Position"
                name="position"
                value={formData.position}
                onChange={onChange}
                placeholder="Position"
                error={errors.position}
            />
            <ProfileFormInput
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={onChange}
                placeholder="Hire Date"
                error={errors.hireDate}
            />
            <ProfileFormInput
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={onChange}
                placeholder="Phone"
                error={errors.phone}
            />
            <div>
                <label className="block text-sm text-gray-600 mb-2">Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={onChange}
                    className={`w-full px-4 py-3 rounded-[16px] bg-white border outline-none transition-all shadow-sm text-gray-900 ${
                        errors.role
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-300 focus:border-gray-400'
                    }`}
                >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                </select>
                {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
            </div>
            <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={onChange}
                    placeholder="Bio"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-[16px] bg-white border outline-none transition-all shadow-sm text-gray-900 placeholder:text-gray-400 resize-none ${
                        errors.bio
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-300 focus:border-gray-400'
                    }`}
                />
                {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileFormFields;

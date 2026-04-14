import React, { useState } from 'react';
import { Button } from '../ui/buttons/Button';
import XIcon from '../icons/XIcon';
import { validateChangePasswordForm } from '../../common/validation/changePasswordValidation';
import { useChangePassword } from '../../common/hooks/useChangePassword';
import type { IChangePasswordModalProps } from '../../common/types/component-types';

const ChangePasswordModal: React.FC<IChangePasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { changePassword, isLoading } = useChangePassword();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateChangePasswordForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await changePassword(
                formData.currentPassword,
                formData.newPassword,
                formData.confirmNewPassword,
            );

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
            setErrors({});
            onClose();
            alert('Password changed successfully!');
        } catch (error) {
            setErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred',
            });
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 w-full max-w-md mx-auto relative z-[10000]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Change Password
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <XIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] text-sm sm:text-base ${
                                errors.currentPassword
                                    ? 'border-red-300'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Enter current password"
                        />
                        {errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] text-sm sm:text-base ${
                                errors.newPassword
                                    ? 'border-red-300'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Enter new password"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] text-sm sm:text-base ${
                                errors.confirmNewPassword
                                    ? 'border-red-300'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Confirm new password"
                        />
                        {errors.confirmNewPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmNewPassword}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            fullWidth={true}
                            onClick={handleClose}
                            disabled={isLoading}
                            className="h-12 text-sm sm:text-base"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth={true}
                            disabled={isLoading}
                            className="h-12 text-sm sm:text-base"
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;

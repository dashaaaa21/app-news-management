import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserById, useUpdateUser } from '../../common/hooks/useUsersCrud';
import { getUserRole } from '../../common/utils/localStorage';
import { Button } from '../../components/ui/buttons/Button';

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const userRole = getUserRole();
    const { data: user, isLoading } = useGetUserById(id || '');
    const updateUserMutation = useUpdateUser();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        phone: '',
        role: 'user' as 'user' | 'admin' | 'manager',
        hireDate: '',
        gender: 'male' as 'male' | 'female' | 'other',
        dateOfBirth: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userRole !== 'admin') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError('Only administrators can edit users');
            const timer = setTimeout(() => {
                navigate('/admin/users');
            }, 2000);
            return () => clearTimeout(timer);
        }

        if (user) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                position: user.position,
                phone: user.phone,
                role: user.role as 'user' | 'admin' | 'manager',
                hireDate: user.hireDate,
                gender: user.gender as 'male' | 'female' | 'other',
                dateOfBirth: user.dateOfBirth,
            }));
        }
    }, [userRole, navigate, user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!id) {
            setError('User ID not found');
            return;
        }
        try {
            await updateUserMutation.mutateAsync({ id, userData: formData });
            navigate('/admin/users');
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to update user';
            setError(errorMessage);
            console.error('Error updating user:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-[36px] border border-black/10 p-8">
                    <p className="text-center">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-[36px] border border-black/10 p-8">
                <h1 className="text-2xl font-semibold mb-6">Edit User</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Position
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Hire Date
                            </label>
                            <input
                                type="date"
                                name="hireDate"
                                value={formData.hireDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded-[20px]"
                            disabled={updateUserMutation.isPending}
                        >
                            {updateUserMutation.isPending
                                ? 'Updating...'
                                : 'Update User'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="rounded-[20px]"
                            onClick={() => navigate('/admin/users')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

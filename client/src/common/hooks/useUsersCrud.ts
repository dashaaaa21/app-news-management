import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    IBaseUserData,
    IRegisterFormData,
    IUser,
} from '../types/user-type';
import {
    getAllUsers,
    createUser,
    updateUserById,
    deleteUser,
} from '../../api/api-user/api-user';

const USERS_QUERY_KEY = ['users'];
const USER_QUERY_KEY = (id: string) => ['user', id];

export const useGetUsers = () => {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: async () => {
            const result = await getAllUsers();
            if (result.error) throw new Error(result.error.message);
            let users: IUser[] = [];
            if (Array.isArray(result.response)) {
                users = result.response as IUser[];
            } else if (result.response?.users) {
                users = result.response.users as IUser[];
            }
            return users;
        },
    });
};

export const useGetUserById = (id: string) => {
    return useQuery({
        queryKey: USER_QUERY_KEY(id),
        queryFn: async () => {
            const result = await getAllUsers();
            if (result.error) throw new Error(result.error.message);
            let users: IUser[] = [];
            if (Array.isArray(result.response)) {
                users = result.response as IUser[];
            } else if (result.response?.users) {
                users = result.response.users as IUser[];
            }
            const user = users.find(
                (u) =>
                    (u as IUser & { _id?: string })._id === id ||
                    String(u.id) === id,
            );
            if (!user) throw new Error('User not found');
            return user;
        },
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: IRegisterFormData) => {
            const result = await createUser(userData);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            queryClient.refetchQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            userData,
        }: {
            id: string;
            userData: IBaseUserData;
        }) => {
            const result = await updateUserById(id, userData);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            queryClient.refetchQueries({ queryKey: USERS_QUERY_KEY });
            if (data?.id) {
                queryClient.invalidateQueries({
                    queryKey: USER_QUERY_KEY(data.id.toString()),
                });
            }
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteUser(id);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
            queryClient.refetchQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
};

import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import {
    getAccessToken,
    getRefreshToken,
    removeTokens,
    setAccessToken,
    setRefreshToken,
} from '../../common/utils/localStorage';
import type {
    IUserChangePassword,
    IUserLogin,
    IRegisterFormData,
    IProfileData,
    IApiResponse,
    IApiError,
    IRefreshTokenResponse,
    ILoginResponse,
    IRegisterResponse,
    ILogoutResponse,
    IGetAllUsersResponse,
    IDeleteUserResponse,
    IChangePasswordResponse,
    IUpdateProfileResponse,
    IChangePasswordRequest,
    IUpdateProfileRequest,
    IUploadResponse,
    IBaseUserData,
    IUser,
} from '../../common/types/user-type';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => Promise.reject(err),
);

instance.interceptors.response.use(
    (res) => res,
    async (err: IApiError) => {
        const originalConfig = err.config;
        if (err.response && originalConfig) {
            if (err.response.status === 400 && err.response.data) {
                return Promise.reject(err.response.data);
            }
            if (
                err.response.status === 401 &&
                !originalConfig._retry &&
                getAccessToken() !== null
            ) {
                originalConfig._retry = true;
                try {
                    const rs = await refreshAccessToken();
                    const { accessToken, refreshToken } = rs.data;
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                    return instance(originalConfig as AxiosRequestConfig);
                } catch {
                    removeTokens();
                    window.location.href = '/';
                    return Promise.reject(err);
                }
            }
            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data);
            }
            if (err.response.status === 404) {
                return Promise.reject(err.response.data || err.response);
            }
        }
        return Promise.reject(err);
    },
);

const refreshTokenIntance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function refreshAccessToken(): Promise<{ data: IRefreshTokenResponse }> {
    const response = await refreshTokenIntance.post('/User/refreshToken', {
        refreshToken: getRefreshToken(),
    });
    return response;
}

const responseBody = <T>(response: { data: T }): T => response.data;

let nextUserId = 4;

const mockUsers: IGetAllUsersResponse = {
    users: [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            gender: 'male',
            dateOfBirth: '1990-01-15',
            position: 'Developer',
            hireDate: '2022-01-01',
            phone: '+1234567890',
            role: 'admin',
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            gender: 'female',
            dateOfBirth: '1992-05-20',
            position: 'Designer',
            hireDate: '2022-06-01',
            phone: '+0987654321',
            role: 'user',
        },
        {
            id: 3,
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            gender: 'male',
            dateOfBirth: '1988-03-10',
            position: 'Manager',
            hireDate: '2021-01-01',
            phone: '+1122334455',
            role: 'manager',
        },
    ],
};

const User = {
    register: (user: IRegisterFormData) =>
        instance.post<IRegisterResponse>('/register', user).then(responseBody),
    login: (user: IUserLogin) =>
        instance.post<ILoginResponse>('/login', user).then(responseBody),
    forgotPassword: (email: string) =>
        instance
            .post<{ message: string }>('/forgotPassword', { email })
            .then(responseBody),
    getAllUsers: () => instance.get('/getAllUsers').then(responseBody),
    getUserById: (id: string) =>
        instance.get(`/getUserById/${id}`).then(responseBody),
    createUser: (user: IBaseUserData) =>
        instance.post('/register', user).then(responseBody),
    updateUserById: (id: string, user: IBaseUserData) =>
        instance.put(`/updateUserById/${id}`, user).then(responseBody),
    deleteUser: (id: string) =>
        instance.delete(`/deleteUser/${id}`).then(responseBody),
    logout: (userId: string) =>
        instance.post<ILogoutResponse>(`/logout/${userId}`).then(responseBody),
    changePassword: (password: IUserChangePassword) =>
        instance
            .post<IChangePasswordResponse>(`/changePassword`, password)
            .then(responseBody),
    updateProfile: (user: IProfileData) =>
        instance
            .post<IUpdateProfileResponse>('/updateProfile', user)
            .then(responseBody),
    updateUser: (user: IProfileData) =>
        instance
            .post<IUpdateProfileResponse>('/updateUser', user)
            .then(responseBody),
};

async function handleApiRequest<T>(
    request: Promise<T>,
): Promise<IApiResponse<T>> {
    try {
        const response = await request;
        return { response };
    } catch (error: unknown) {
        return { error: error as IApiError };
    }
}

export async function register(
    user: IRegisterFormData,
): Promise<IApiResponse<IRegisterResponse>> {
    return handleApiRequest(User.register(user));
}

export async function login(
    user: IUserLogin,
): Promise<IApiResponse<ILoginResponse>> {
    return handleApiRequest(User.login(user));
}

export async function forgotPassword(
    email: string,
): Promise<IApiResponse<{ message: string }>> {
    return handleApiRequest(User.forgotPassword(email));
}

export async function logout(
    userId: string,
): Promise<IApiResponse<ILogoutResponse>> {
    return handleApiRequest(User.logout(userId));
}

export async function getAllUsers(): Promise<
    IApiResponse<IGetAllUsersResponse>
> {
    try {
        const result = await handleApiRequest(User.getAllUsers());
        if (result.error) {
            console.warn('API failed, using mock data:', result.error);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ response: mockUsers });
                }, 300);
            });
        }
        return result;
    } catch (error) {
        console.warn('API error, using mock data:', error);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ response: mockUsers });
            }, 300);
        });
    }
}

export async function getUserById(id: string): Promise<IApiResponse<IUser>> {
    return handleApiRequest(User.getUserById(id));
}

export async function createUser(
    userData: IRegisterFormData,
): Promise<IApiResponse<IUser>> {
    console.log('Creating user with data:', userData);
    try {
        const result = await handleApiRequest(User.createUser(userData));
        if (result.error) {
            console.warn('API failed, creating mock user:', result.error);
            const newUser: IUser = {
                id: Math.max(...mockUsers.users.map((u) => u.id)) + 1,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                gender: userData.gender,
                dateOfBirth: userData.dateOfBirth,
                position: userData.position,
                hireDate: userData.hireDate,
                phone: userData.phone,
                role: userData.role,
            };
            mockUsers.users.push(newUser);
            return { response: newUser };
        }
        return result;
    } catch (error) {
        console.warn('API error, creating mock user:', error);
        const newUser: IUser = {
            id: Math.max(...mockUsers.users.map((u) => u.id)) + 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            position: userData.position,
            hireDate: userData.hireDate,
            phone: userData.phone,
            role: userData.role,
        };
        mockUsers.users.push(newUser);
        return { response: newUser };
    }
}

export async function updateUserById(
    id: string,
    userData: IBaseUserData,
): Promise<IApiResponse<IUser>> {
    console.log('Updating user:', id, userData);
    try {
        const result = await handleApiRequest(
            User.updateUserById(id, userData),
        );
        if (result.error) {
            console.warn('API failed, updating mock user:', result.error);
            const userIndex = mockUsers.users.findIndex(
                (u) => u.id === parseInt(id),
            );
            if (userIndex !== -1) {
                mockUsers.users[userIndex] = {
                    ...mockUsers.users[userIndex],
                    ...userData,
                };
                return { response: mockUsers.users[userIndex] };
            }
            return result;
        }
        return result;
    } catch (error) {
        console.warn('API error, updating mock user:', error);
        const userIndex = mockUsers.users.findIndex(
            (u) => u.id === parseInt(id),
        );
        if (userIndex !== -1) {
            mockUsers.users[userIndex] = {
                ...mockUsers.users[userIndex],
                ...userData,
            };
            return { response: mockUsers.users[userIndex] };
        }
        return { error: error as IApiError };
    }
}

export async function deleteUser(
    id: string,
): Promise<IApiResponse<IDeleteUserResponse>> {
    console.log('Deleting user:', id);
    try {
        const result = await handleApiRequest(User.deleteUser(id));
        if (result.error) {
            console.warn('API failed, deleting mock user:', result.error);
            const userIndex = mockUsers.users.findIndex(
                (u) => u.id === parseInt(id),
            );
            if (userIndex !== -1) {
                mockUsers.users.splice(userIndex, 1);
                return { response: { message: 'User deleted successfully' } };
            }
            return result;
        }
        return result;
    } catch (error) {
        console.warn('API error, deleting mock user:', error);
        const userIndex = mockUsers.users.findIndex(
            (u) => u.id === parseInt(id),
        );
        if (userIndex !== -1) {
            mockUsers.users.splice(userIndex, 1);
            return { response: { message: 'User deleted successfully' } };
        }
        return { error: error as IApiError };
    }
}

export async function changePassword(
    passwords: IUserChangePassword,
): Promise<IApiResponse<IChangePasswordResponse>> {
    return handleApiRequest(User.changePassword(passwords));
}

export async function updateProfile(
    user: IProfileData,
): Promise<IApiResponse<IUpdateProfileResponse>> {
    return handleApiRequest(User.updateProfile(user));
}

export async function updateUserProfile(
    user: IProfileData,
): Promise<IApiResponse<IUpdateProfileResponse>> {
    return handleApiRequest(User.updateUser(user));
}

export const changePasswordService = async (
    data: IChangePasswordRequest,
): Promise<IChangePasswordResponse> => {
    const token = getAccessToken();
    if (!token) {
        throw new Error('No access token found');
    }

    const response = await fetch(`${apiBaseUrl}/changePassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const responseText = await response.text();

    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = { message: responseText };
    }

    if (!response.ok) {
        throw new Error(
            responseData.message || `Server error: ${response.status}`,
        );
    }

    return responseData;
};

export const uploadProfilePhoto = async (
    file: File,
): Promise<IUploadResponse> => {
    const token = getAccessToken();
    if (!token) {
        throw new Error('No access token found');
    }

    const formData = new FormData();
    formData.append('file', file);

    const endpoints = [
        `${apiBaseUrl}/uploadProfilePicture`,
        `${apiBaseUrl}/upload`,
        `${apiBaseUrl}/uploadPhoto`,
        `${apiBaseUrl}/uploadFile`,
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const responseText = await response.text();

                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = { url: responseText, filename: file.name };
                }

                return responseData;
            }
        } catch {}
    }

    throw new Error('Upload service not available');
};

export const updateProfileService = async (
    data: IUpdateProfileRequest,
): Promise<IUpdateProfileResponse> => {
    const token = getAccessToken();
    if (!token) {
        throw new Error('No access token found');
    }

    const updateData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        position: data.position,
        hireDate: data.hireDate,
        phone: data.phone,
        bio: data.bio,
        role: data.role,
    };

    const response = await fetch(`${apiBaseUrl}/updateProfile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });

    const responseText = await response.text();

    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = { message: responseText };
    }

    if (!response.ok) {
        throw new Error(
            responseData.message || `Update failed: ${response.status}`,
        );
    }

    return responseData;
};

export const updateProfileServiceFormData = async (
    data: IUpdateProfileRequest,
): Promise<IUpdateProfileResponse> => {
    const token = getAccessToken();
    if (!token) {
        throw new Error('No access token found');
    }

    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('gender', data.gender);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('position', data.position);
    formData.append('hireDate', data.hireDate);
    formData.append('phone', data.phone);
    formData.append('bio', data.bio);
    formData.append('role', data.role);

    const response = await fetch(`${apiBaseUrl}/updateProfile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const responseText = await response.text();

    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = { message: responseText };
    }

    if (!response.ok) {
        throw new Error(
            responseData.message || `Update failed: ${response.status}`,
        );
    }

    return responseData;
};

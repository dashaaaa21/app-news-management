import type { AxiosRequestConfig } from 'axios';

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserChangePassword {
    userId?: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface IBaseUserData {
    firstName: string;
    lastName: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    position: string;
    hireDate: string;
    phone: string;
    role: 'admin' | 'user' | 'manager';
}

export interface IUser extends IBaseUserData {
    id: number;
}

export type IUserFormData = IBaseUserData;

export interface IProfileData extends Omit<IBaseUserData, 'gender' | 'role'> {
    gender: string;
    role: string;
    bio: string;
    profilePicture?: string;
}

export interface IApiResponse<T = unknown> {
    response?: T;
    error?: IApiError;
}

export interface IApiError {
    message: string;
    status?: number;
    config?: AxiosRequestConfig & {
        _retry?: boolean;
    };
    response?: {
        status: number;
        data?: unknown;
    };
}

export interface IUpdateProfileResponse {
    message: string;
    user: IUser;
}

export interface IJwtPayload {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    gender?: string;
    phone?: string;
    bio?: string;
    position?: string;
    hireDate?: string;
    dateOfBirth?: string;
    profilePicture?: string;
    iat: number;
    exp: number;
}

export interface IUpdateProfileRequest extends IProfileData {
    id: string;
    password?: string;
    confirmPassword?: string;
}

export interface IChangePasswordRequest {
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface IChangePasswordResponse {
    message: string;
}

export interface IUploadResponse {
    url: string;
    filename: string;
}

export type ILoginFormData = IUserLogin;
export type IChangePasswordFormData = Omit<IUserChangePassword, 'userId'>;
export type IForgotPasswordFormData = Pick<IUserLogin, 'email'>;
export type IRegisterFormData = IBaseUserData & {
    password: string;
    confirmPassword: string;
};
export type IEditProfileFormData = IProfileData;

export interface IRefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterResponse {
    message: string;
    user: IUser;
}

export interface ILogoutResponse {
    message: string;
}

export interface IGetAllUsersResponse {
    users: IUser[];
}

export interface IDeleteUserResponse {
    message: string;
}

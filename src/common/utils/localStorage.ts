import type { IUser } from '../types/user-type';

export function setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
}

export function setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
}

export function setUserEmail(email: string): void {
    localStorage.setItem('userEmail', email);
}

export function setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
}

export function setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
}

export function getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
}

export function getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
}

export function getUserId(): string | null {
    return localStorage.getItem('userId');
}

export function getUserRole(): string | null {
    return localStorage.getItem('userRole');
}

export function setSelectedUser(user: IUser): void {
    localStorage.setItem('selectedUser', JSON.stringify(user));
}

export function getSelectedUser(): IUser | null {
    const selectedUser = localStorage.getItem('selectedUser');
    return selectedUser ? JSON.parse(selectedUser) : null;
}

export function removeTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('selectedUser');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
}

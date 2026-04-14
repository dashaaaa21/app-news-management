const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/user';
const SERVER_BASE_URL = API_BASE_URL.replace('/api/user', '');

export const getApiUrl = (endpoint: string): string => {
    if (endpoint.startsWith('/api/user/')) {
        return `${SERVER_BASE_URL}${endpoint}`;
    }
    if (endpoint.startsWith('/api/')) {
        return `${SERVER_BASE_URL}${endpoint}`;
    }
    if (endpoint.startsWith('/')) {
        return `${SERVER_BASE_URL}${endpoint}`;
    }
    return `${API_BASE_URL}/${endpoint}`;
};

export const getServerUrl = (path: string = ''): string => {
    return `${SERVER_BASE_URL}${path}`;
};

export { API_BASE_URL, SERVER_BASE_URL };

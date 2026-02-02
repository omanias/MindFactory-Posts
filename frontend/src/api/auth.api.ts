import api from './axios';

export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export const authApi = {
    login: (credentials: { email: string; password: string }) =>
        api.post<AuthResponse>('/auth/login', credentials),

    register: (userData: { name: string; email: string; password: string }) =>
        api.post<AuthResponse>('/auth/register', userData),
};

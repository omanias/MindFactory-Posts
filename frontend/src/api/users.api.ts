import api from './axios';

export interface UserData {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

export const usersApi = {
    getAll: () =>
        api.get<UserData[]>('/users'),

    update: (id: number, userData: { name?: string; email?: string }) =>
        api.patch<UserData>(`/users/${id}`, userData),
};

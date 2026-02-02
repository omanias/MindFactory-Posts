import api from './axios';

export interface Post {
    id: number;
    title: string;
    content: string;
    userId: number;
    likedBy: number[];
    dislikedBy: number[];
    createdAt: string;
}

export interface PaginatedPosts {
    data: Post[];
    total: number;
}

export const postsApi = {
    getAll: (page: number, limit: number) =>
        api.get<PaginatedPosts>(`/posts?page=${page}&limit=${limit}`),

    getOne: (id: number) =>
        api.get<Post>(`/posts/${id}`),

    create: (postData: { title: string; content: string }) =>
        api.post<Post>('/posts', postData),

    update: (id: number, postData: { title?: string; content?: string }) =>
        api.patch<Post>(`/posts/${id}`, postData),

    remove: (id: number) =>
        api.delete(`/posts/${id}`),

    like: (id: number) =>
        api.post<Post>(`/posts/like/${id}`),

    dislike: (id: number) =>
        api.post<Post>(`/posts/dislike/${id}`),
};

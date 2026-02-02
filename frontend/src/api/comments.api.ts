import api from './axios';

export interface Comment {
    id: number;
    content: string;
    userId: number;
    postId: number;
    createdAt: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export const commentsApi = {
    getByPost: (postId: number) =>
        api.get<Comment[]>(`/posts/${postId}/comments`),

    count: (postId: number) =>
        api.get<number>(`/posts/${postId}/comments/count`),

    create: (postId: number, content: string) =>
        api.post<Comment>(`/posts/${postId}/comments`, { content }),

    update: (postId: number, commentId: number, content: string) =>
        api.patch<Comment>(`/posts/${postId}/comments/${commentId}`, { content }),

    remove: (postId: number, commentId: number) =>
        api.delete(`/posts/${postId}/comments/${commentId}`),
};

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';
import { commentsApi, type Comment } from '../api/comments.api';
import { Button } from './Button';
import { ConfirmDialog } from './ConfirmDialog';

interface CommentsProps {
    postId: number;
    currentUserId?: number;
}

export function Comments({ postId, currentUserId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; commentId: number | null }>({
        isOpen: false,
        commentId: null
    });

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments, postId]);

    const fetchComments = async () => {
        try {
            setFetchingComments(true);
            const response = await commentsApi.getByPost(postId);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setFetchingComments(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            await commentsApi.create(postId, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId: number) => {
        setConfirmDialog({ isOpen: true, commentId });
    };

    const confirmDelete = async () => {
        if (!confirmDialog.commentId) return;

        try {
            await commentsApi.remove(postId, confirmDialog.commentId);
            setConfirmDialog({ isOpen: false, commentId: null });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const cancelDelete = () => {
        setConfirmDialog({ isOpen: false, commentId: null });
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleUpdate = async (commentId: number) => {
        if (!editContent.trim()) return;

        try {
            await commentsApi.update(postId, commentId, editContent);
            handleCancelEdit();
            fetchComments();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Toggle Comments Button */}
            <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
                <MessageSquare className="w-4 h-4" />
                {showComments ? 'Ocultar' : 'Ver'} comentarios ({comments.length})
            </button>

            {showComments && (
                <div className="mt-4 space-y-4">
                    {/* Add Comment Form */}
                    {currentUserId && (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm dark:text-gray-100 dark:placeholder-gray-500"
                            />
                            <Button
                                type="submit"
                                disabled={loading || !newComment.trim()}
                                className="px-4 py-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Comments List */}
                    {fetchingComments ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
                            No hay comentarios aún. ¡Sé el primero en comentar!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 transition-colors"
                                >
                                    {editingId === comment.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm dark:text-gray-100 resize-none"
                                                rows={2}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(comment.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                                        {comment.user?.name || 'Usuario'}
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                                {currentUserId === comment.userId && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleStartEdit(comment)}
                                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(comment.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Eliminar comentario"
                message="¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer."
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}

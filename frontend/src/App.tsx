import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Plus, Trash2, MessageSquare, Clock } from 'lucide-react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Comments } from './components/Comments';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { Layout } from './components/Layout';
import { postsApi } from './api/posts.api';
import type { Post } from './api/posts.api';

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; postId: number | null }>({
    isOpen: false,
    postId: null
  });

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await postsApi.getAll(page, limit);
      setPosts(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      await postsApi.create({ title, content });
      setTitle('');
      setContent('');
      if (page === 1) {
        fetchPosts();
      } else {
        setPage(1);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: number) => {
    try {
      await postsApi.like(id);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (id: number) => {
    try {
      await postsApi.dislike(id);
      fetchPosts();
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, postId: id });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.postId) return;

    try {
      await postsApi.remove(confirmDialog.postId);
      setConfirmDialog({ isOpen: false, postId: null });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, postId: null });
  };

  const handleStartEdit = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle || !editContent) return;

    try {
      await postsApi.update(editingId, { title: editTitle, content: editContent });
      handleCancelEdit();
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:grid-cols-3 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Post Form */}
        <div className="lg:col-span-1">
          <Card title="Nueva Publicación" subtitle="Comparte tus pensamientos con la comunidad">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ingresa el título"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm dark:text-gray-100 dark:placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="¿En qué estás pensando?"
                  rows={4}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm dark:text-gray-100 dark:placeholder-gray-500 resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Crear Publicación'}
                {!loading && <Plus className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </Card>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">Publicaciones Recientes</h2>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50 transition-colors">
              {total} {total === 1 ? 'Publicación' : 'Publicaciones'}
            </span>
          </div>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
                <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No hay publicaciones</h3>
                <p className="text-gray-500 mt-1">Comienza creando tu primera publicación usando el formulario.</p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                    {editingId === post.id ? (
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                          required
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600 resize-none"
                          required
                        />
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">Guardar</Button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                              {post.content}
                            </p>
                          </div>
                          {user && user.id === post.userId && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEdit(post)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Reactions */}
                        <div className="mt-6 flex items-center gap-3">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${post.likedBy.includes(user?.id)
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                              }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={post.likedBy.includes(user?.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                            {post.likedBy.length}
                          </button>
                          <button
                            onClick={() => handleDislike(post.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${post.dislikedBy.includes(user?.id)
                              ? 'bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-none'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                              }`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={post.dislikedBy.includes(user?.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                            {post.dislikedBy.length}
                          </button>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 uppercase tracking-widest text-[10px] font-bold text-gray-400 dark:text-gray-500 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 transition-colors">
                            ID: {post.id}
                          </div>
                        </div>

                        {/* Comments Section */}
                        <Comments postId={post.id} currentUserId={user?.id} />
                      </>
                    )}
                  </Card>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-100/50 dark:shadow-none transition-colors">
                      {page} / {totalPages}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar publicación"
        message="¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Feed />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

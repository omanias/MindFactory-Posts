import { useState, useEffect } from 'react';
import { User, Mail, Save, X, Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { usersApi } from '../api/users.api';
import type { UserData } from '../api/users.api';

export function ProfilePage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await usersApi.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (user: UserData) => {
        setEditingId(user.id);
        setEditName(user.name);
        setEditEmail(user.email);
        setMessage({ type: '', text: '' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditEmail('');
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        setUpdating(true);
        try {
            await usersApi.update(editingId, {
                name: editName,
                email: editEmail,
            });

            // Update local storage if current user was updated
            if (currentUser && currentUser.id === editingId) {
                const updatedUser = { ...currentUser, name: editName, email: editEmail };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
            handleCancelEdit();
            fetchUsers();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 italic transition-colors">Comunidad MindFactory</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">Conoce a los miembros y gestiona tu información</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-2xl border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                    } font-bold text-sm text-center shadow-sm`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.map((user) => (
                    <Card key={user.id} className={`group border-none ring-1 transition-all duration-500 overflow-hidden ${editingId === user.id
                        ? 'ring-indigo-500 shadow-2xl scale-[1.02]'
                        : 'ring-gray-100 dark:ring-gray-800 hover:ring-indigo-200 dark:hover:ring-indigo-900 hover:shadow-xl dark:bg-gray-900'
                        }`}>
                        <div className="relative p-1">
                            {currentUser && currentUser.id === user.id && (
                                <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none z-10" title="Tu Perfil">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            )}

                            {editingId === user.id ? (
                                <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="bg-indigo-50 p-4 rounded-3xl mb-4 border border-indigo-100">
                                            <UserCircle className="w-12 h-12 text-indigo-600" />
                                        </div>
                                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Editando Perfil</label>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                                placeholder="Nombre completo"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                                placeholder="Correo electrónico"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-6">
                                        <Button type="submit" className="flex-1 py-3 shadow-lg shadow-indigo-100 dark:shadow-none" disabled={updating}>
                                            {updating ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
                                            Guardar
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-bold"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex items-center gap-4 py-2">
                                    <div className={`p-4 rounded-3xl border transition-all duration-500 ${currentUser?.id === user.id
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50'
                                        }`}>
                                        <UserCircle className="w-10 h-10" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight transition-colors">{user.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300 truncate transition-colors">
                                            <Mail className="w-3.5 h-3.5" />
                                            {user.email}
                                        </div>
                                    </div>

                                    {currentUser && currentUser.id === user.id && (
                                        <button
                                            onClick={() => handleStartEdit(user)}
                                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

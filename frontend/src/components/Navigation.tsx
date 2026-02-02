import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Navigation() {
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Muro' },
        { path: '/profile', label: 'Usuarios' },
    ];

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img
                                    src="/main-image.png"
                                    alt="Logo"
                                    className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300 ring-2 ring-indigo-50 dark:ring-gray-800 ring-offset-2 dark:ring-offset-gray-900"
                                />
                                <div className="absolute inset-0 rounded-xl bg-indigo-600/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white tracking-tight hidden sm:block">
                                MindFactory
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {user && (
                            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                <div className="bg-indigo-600 p-1 rounded-full">
                                    <UserIcon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</span>
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors group"
                        >
                            <span>Salir</span>
                            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-4 space-y-2 animate-in slide-in-from-top-4 duration-200 transition-colors duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${location.pathname === link.path
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            <span>Modo {theme === 'light' ? 'Oscuro' : 'Claro'}</span>
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {user && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="bg-indigo-600 p-1.5 rounded-full">
                                    <UserIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</span>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                        >
                            <span>Cerrar Sesión</span>
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Check, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { authApi } from '../api/auth.api';

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPasswordHints, setShowPasswordHints] = useState(false);
    const navigate = useNavigate();

    // Validaciones de contraseña
    const passwordValidations = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[@$!%*?&]/.test(password),
    };

    const isPasswordValid = Object.values(passwordValidations).every(Boolean);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validar contraseña antes de enviar
        if (!isPasswordValid) {
            setError('La contraseña no cumple con los requisitos de seguridad');
            setLoading(false);
            setShowPasswordHints(true);
            return;
        }

        try {
            const response = await authApi.register({ name, email, password });
            sessionStorage.setItem('token', response.data.access_token);
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="px-10 py-8 overflow-visible">
                    <div className="flex justify-center flex-col items-center gap-4 mb-8">
                        <div className="relative group">
                            <img
                                src="/main-image.png"
                                alt="Logo"
                                className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl shadow-indigo-200 dark:shadow-none transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 rounded-[2rem] bg-indigo-600/5 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="text-center space-y-1">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">MindFactory</h2>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-extrabold uppercase tracking-[.3em]">Crea · Conecta · Comparte</p>
                        </div>
                    </div>
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/50 italic animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                Nombre Completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                                    placeholder="Tu Nombre"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setShowPasswordHints(true)}
                                    className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Indicadores de requisitos de contraseña */}
                            {showPasswordHints && password.length > 0 && (
                                <div className="mt-3 space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">La contraseña debe contener:</p>

                                    <div className="flex items-center gap-2">
                                        {passwordValidations.minLength ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-xs ${passwordValidations.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            Al menos 8 caracteres
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {passwordValidations.hasUpperCase ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-xs ${passwordValidations.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            Una letra mayúscula (A-Z)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {passwordValidations.hasLowerCase ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-xs ${passwordValidations.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            Una letra minúscula (a-z)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {passwordValidations.hasNumber ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-xs ${passwordValidations.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            Un número (0-9)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {passwordValidations.hasSpecialChar ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={`text-xs ${passwordValidations.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                            Un carácter especial (@$!%*?&)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-3 shadow-lg shadow-indigo-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Registrando...
                                    </>
                                ) : (
                                    'Registrarse'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import backgroundLogin from '../assets/backgroundLogin.webp';
import Logo from '../assets/logo.png';
import Typewriter from '../components/common/typewriter/Typewriter';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Schema de validação com zod
const loginSchema = z.object({
    email: z
        .email({ error: 'E-mail inválido.' })
        .nonempty('E-mail é obrigatório.'),
    password: z
        .string()
        .nonempty('Senha é obrigatória.')
        .min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' }),
});

type LoginData = z.infer<typeof loginSchema>;
export default function Login() {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { isLoading, errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginData) => {
        try {
            await login(data);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response.data.message, {
                position: 'top-center',
                richColors: true,
            });
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-stone-950 p-4">
            <div className="flex w-full max-w-5xl rounded-2xl shadow-[0_0_30px_0_rgba(116,28,233,0.25)] text-white overflow-hidden z-10">
                <div className="flex flex-col w-full md:w-1/2 justify-center items-center gap-6 p-8">
                    <h2 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-violet-500 via-cyan-600 to-violet-700 bg-clip-text text-transparent">
                        Login{' '}
                        <span className="block w-10 h-10 animate-pulse">
                            <img
                                className="size-full object-fit"
                                src={Logo}
                                alt="Logo"
                            />
                        </span>
                    </h2>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 w-full flex flex-col"
                    >
                        <div className="relative h-16">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                autoComplete="email"
                                className={`block px-4 pb-2.5 pt-5 w-full text-sm text-white bg-stone-900 rounded-lg
                 focus:outline-none focus:ring-2 peer shadow-[0_0_15px_0_rgba(0,0,0,90)]
                 ${
                     errors.email
                         ? 'border-red-500 focus:ring-red-500'
                         : 'border-gray-600 focus:ring-violet-500'
                 }`}
                                {...register('email')}
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 left-4 peer-focus:text-violet-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
                            >
                                E-mail
                            </label>
                            {errors.email && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="relative h-16">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder=" "
                                    autoComplete="current-password"
                                    className={`block px-4 pb-2.5 pt-5 w-full text-sm text-white bg-stone-900 rounded-lg
                   focus:outline-none focus:ring-2 peer pr-10 shadow-[0_0_15px_0_rgba(0,0,0,90)]
                   ${
                       errors.password
                           ? 'border-red-500 focus:ring-red-500'
                           : 'border-gray-600 focus:ring-violet-500'
                   }`}
                                    {...register('password')}
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 left-4 peer-focus:text-violet-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
                                >
                                    Senha
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-violet-400 transition-colors"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full cursor-pointer bg-gradient-to-r from-violet-600 to-violet-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-70"
                        >
                            <span className="flex justify-center items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Entrando...
                                    </>
                                ) : (
                                    'Entrar'
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm">
                        Novo por aqui?{' '}
                        <Link
                            className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                            to="/register"
                        >
                            Crie uma conta.
                        </Link>
                    </p>
                </div>

                <div className="hidden md:flex items-center justify-center relative w-1/2 bg-gradient-to-br from-violet-900/70 to-violet-600/70 overflow-hidden">
                    <img
                        className="absolute size-full object-cover mix-blend-overlay"
                        src={backgroundLogin}
                        alt="background Login"
                        loading="lazy"
                    />
                    <div className="flex flex-col items-center p-8 gap-4 z-10 text-center">
                        <h2 className="text-4xl font-bold">
                            <Typewriter
                                speed={80}
                                texts={[
                                    'Bem-vindo de volta!',
                                    'De volta à ativa!',
                                    'Login seguro e rápido',
                                    'Vamos continuar?',
                                ]}
                            />
                        </h2>
                        <p className="text-center text-gray-100">
                            Faça login para acessar sua conta e continuar de
                            onde parou.
                        </p>
                        <div className="w-12 h-1 bg-violet-400 my-2 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

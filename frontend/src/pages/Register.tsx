import LoadingSpinner from '../components/ui/LoadingSpinner';
import Typewriter from '../components/common/typewriter/Typewriter';
import Logo from '../assets/logo.png';
import backgroundLogin from '../assets/backgroundLogin.webp';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import { type FormEvent } from 'react';

export default function Register() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<{
        code: string;
        message: { field: string; message: string; code: string }[] | string;
    }>({
        code: '',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const validations = {
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*]/.test(password),
        hasMinLength: password.length >= 8,
    };

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!name || !email || !password) {
            return;
        }
        setLoading(true);
        try {
            await register({ name, email, password });
            navigate('/');
        } catch (err: any) {
            setError({
                code: err.response.data.code,
                message: err.response.data.message || err.response.data.details,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-stone-950 p-4 ">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_50%)]"></div>

                <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                <div
                    className="absolute top-2/3 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{ animationDelay: '700ms' }}
                ></div>
                <div
                    className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-ping"
                    style={{ animationDelay: '1400ms' }}
                ></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
            </div>
            <div data-aos="fade-up" data-aos-duration="1500" className="flex w-full max-w-5xl rounded-2xl shadow-[0_0_30px_0_rgba(116,28,233,0.25)] text-white overflow-hidden z-10">
                <div className="flex flex-col w-full md:w-1/2 justify-center items-center gap-6 p-8">
                    <h2 className="flex justify-items items-center gap-2 text-3xl font-bold bg-gradient-to-r from-violet-500 via-cyan-600 to-violet-700 bg-clip-text text-transparent">
                        Sign Up{' '}
                        <span className="block w-10 h-10 animate-pulse">
                            <img
                                className="size-full object-fit"
                                src={Logo}
                                alt="Logo"
                            />
                        </span>
                    </h2>
                    <form
                        className="space-y-4 w-full flex flex-col"
                        onSubmit={handleSubmit}
                    >
                        <div className="relative h-16">
                            <input
                                type="text"
                                onChange={(e) => {
                                    setError({ code: '', message: '' });
                                    setName(e.target.value);
                                }}
                                value={name}
                                id="name"
                                className={`block px-4 pb-2.5 pt-5 w-full text-sm text-white bg-stone-900  
                                    rounded-lg appearance-none focus:outline-none focus:ring-2 peer shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                    ${
                                        error.code === 'USER_NOT_FOUND'
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="name"
                                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 
                                    scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-violet-400 
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                                    peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                Name
                            </label>
                            {isSubmitted && !name && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    Name is required
                                </span>
                            )}

                            {typeof error.message !== 'string' &&
                                error.message[0].field === 'name' && (
                                    <span className="text-red-400 text-xs mt-1 block">
                                        {error.message[0].message}
                                    </span>
                                )}
                        </div>

                        <div className="relative h-16">
                            <input
                                type="email"
                                onChange={(e) => {
                                    setError({ code: '', message: '' });
                                    setEmail(e.target.value);
                                }}
                                value={email}
                                id="email"
                                className={`block px-4 pb-2.5 pt-5 w-full text-sm text-white bg-stone-900  
                                    rounded-lg appearance-none focus:outline-none focus:ring-2 peer shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                    ${
                                        error.code === 'USER_NOT_FOUND'
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500 '
                                    }`}
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 
                                    scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-violet-400 
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                                    peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                E-mail
                            </label>
                            {isSubmitted && !email && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    Email is required
                                </span>
                            )}
                            {error.code === 'USER_EMAIL_ALREADY_EXISTS' && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    {error.message as string}
                                </span>
                            )}
                        </div>

                        <div className="relative h-16">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => {
                                        setError({ code: '', message: '' });
                                        setPassword(e.target.value);
                                    }}
                                    value={password}
                                    id="password"
                                    className={`block px-4 pb-2.5 pt-5 w-full text-sm text-white bg-stone-900 
                                        rounded-lg appearance-none focus:outline-none focus:ring-2 peer pr-10 shadow-[0_0_15px_0_rgba(0,0,0, 90)]
                                        ${
                                            error.code ===
                                            'AUTH_INVALID_PASSWORD'
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-violet-500 focus:ring-violet-500'
                                        }`}
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 
                                        scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-violet-400 
                                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                                        peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-violet-400 transition-colors"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {!showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {isSubmitted && !password && (
                                <span className="text-red-400 text-xs mt-1 block">
                                    Password is required
                                </span>
                            )}

                            {typeof error.message !== 'string' &&
                                error.message[0].field === 'password' && (
                                    <span className="text-red-400 text-xs mt-1 block">
                                        Password invalid
                                    </span>
                                )}
                        </div>

                        <div className="bg-stone-900/50 p-2 rounded-sm">
                            <h2 className="text-gray-400 text-xs">
                                Create a strong password with at least:
                            </h2>
                            <div className="flex flex-col gap-0.5">
                                <p className="flex items-center gap-2 text-gray-500 text-xs">
                                    {validations.hasUppercase ? (
                                        <FaCheck className="text-green-500" />
                                    ) : (
                                        <MdError className="text-red-500" />
                                    )}{' '}
                                    1 capital letter (A–Z){' '}
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 text-xs">
                                    {validations.hasLowercase ? (
                                        <FaCheck className="text-green-500" />
                                    ) : (
                                        <MdError className="text-red-500" />
                                    )}{' '}
                                    1 lowercase letter (a–z)
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 text-xs">
                                    {validations.hasNumber ? (
                                        <FaCheck className="text-green-500" />
                                    ) : (
                                        <MdError className="text-red-500" />
                                    )}{' '}
                                    1 number (0–9)
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 text-xs">
                                    {validations.hasSpecialChar ? (
                                        <FaCheck className="text-green-500" />
                                    ) : (
                                        <MdError className="text-red-500" />
                                    )}{' '}
                                    1 special symbol (!@#$%^&*)
                                </p>
                                <p className="flex items-center gap-2 text-gray-500 text-xs">
                                    {validations.hasMinLength ? (
                                        <FaCheck className="text-green-500" />
                                    ) : (
                                        <MdError className="text-red-500" />
                                    )}{' '}
                                    8 characters minimum (8 letters)
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full bg-gradient-to-r from-violet-600 to-violet-800 
                                text-white font-bold py-3 px-8 rounded-xl cursor-pointer 
                                transform transition-all duration-300 ease-out
                                hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/30
                                active:scale-[0.99]
                                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-stone-950 
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                                group overflow-hidden mt-2"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                            ></div>

                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link
                            className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                            to={'/login'}
                        >
                            Login
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
                                    'Welcome!',
                                    'Shall we get started?',
                                    'Create your account',
                                    'Sign up securely',
                                ]}
                            />
                        </h2>
                        <p className="text-center text-gray-100">
                            Start now and have full access to what we have
                            prepared for you.
                        </p>
                        <div className="w-12 h-1 bg-violet-400 my-2 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

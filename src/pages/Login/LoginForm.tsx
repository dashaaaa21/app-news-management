import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api-user/api-user';
import {
    setAccessToken,
    setRefreshToken,
    setUserEmail,
    setUserId,
    setUserRole,
} from '../../common/utils/localStorage';

import googleIcon from '../../../assets/icons/google.svg';
import fbIcon from '../../../assets/icons/facebook.svg';
import appleIcon from '../../../assets/icons/apple.svg';
import userIcon from '../../../assets/icons/login-user.svg';
import eyeClosedIcon from '../../../assets/icons/eye-closed.svg';
import eyeOpenIcon from '../../../assets/icons/eye-open.svg';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [touched, setTouched] = useState<{
        login: boolean;
        password: boolean;
    }>({
        login: false,
        password: false,
    });

    const validateLogin = (value: string): string => {
        if (!value.trim()) {
            return 'Required field';
        }
        const emailRegex = /@/;
        if (!emailRegex.test(value)) {
            return 'Invalid email';
        }
        return '';
    };

    const validatePassword = (value: string): string => {
        if (!value) {
            return 'Required field';
        }
        if (value.length < 6) {
            return 'Invalid password';
        }
        return '';
    };

    const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (touched.login) {
            setLoginError(validateLogin(value));
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (touched.password) {
            setPasswordError(validatePassword(value));
        }
    };

    const handleLoginBlur = () => {
        setTouched((prev) => ({ ...prev, login: true }));
        setLoginError(validateLogin(email));
    };

    const handlePasswordBlur = () => {
        setTouched((prev) => ({ ...prev, password: true }));
        setPasswordError(validatePassword(password));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newLoginError = validateLogin(email);
        const newPasswordError = validatePassword(password);

        setLoginError(newLoginError);
        setPasswordError(newPasswordError);
        setTouched({ login: true, password: true });

        if (!newLoginError && !newPasswordError) {
            setIsLoading(true);
            const { response, error } = await login({ email, password });

            console.log('Login response:', response);
            console.log('Login error:', error);

            if (response) {
                const { accessToken, refreshToken } = response;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setUserEmail(email);

                let payload: { id?: string; role?: string } | null = null;
                try {
                    payload = JSON.parse(atob(accessToken.split('.')[1])) as {
                        id?: string;
                        role?: string;
                    };
                    if (payload.id) setUserId(payload.id);
                    if (payload.role) setUserRole(payload.role.toLowerCase());
                } catch (_e) {
                    void _e;
                }

                if (!payload?.role) {
                    if (email === 'daryna2003tk@gmail.com') {
                        setUserRole('administrator');
                    } else {
                        setUserRole('user');
                    }
                }

                navigate('/admin/dashboard');
            } else {
                const errorMessage =
                    (error?.response?.data as { message?: string })?.message ||
                    error?.message ||
                    'Invalid email or password';
                setLoginError(errorMessage);
            }
            setIsLoading(false);
        }
    };

    const hasLoginError = loginError && touched.login;
    const hasPasswordError = passwordError && touched.password;

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-DEFAULT w-full p-4 overflow-hidden">
            <div className="relative w-full max-w-[585px] rounded-[36px] overflow-hidden p-[4px] shadow-sm">
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_120deg,#D7FF82_180deg,transparent_180deg_300deg,#D7FF82_360deg)] animate-[spin_4s_linear_infinite]"></div>

                <div className="relative z-10 bg-white rounded-[32px] w-full h-full p-[60px] md:p-[100px] flex flex-col gap-10">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
                            Hi, Welcome Back
                        </h1>
                        <p className="text-base text-gray-600">
                            Please sign in!
                        </p>
                    </div>

                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <div className="relative">
                                <img
                                    src={userIcon}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 z-10"
                                    alt=""
                                />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={handleLoginChange}
                                    onBlur={handleLoginBlur}
                                    disabled={isLoading}
                                    className={`w-full pl-12 pr-4 pt-6 pb-3 rounded-[16px] outline-none text-[14px] border-2 transition-all ${
                                        hasLoginError
                                            ? 'border-[#FF8A8A] bg-[#FFF5F5]'
                                            : 'border-transparent bg-[#F5F5F5]'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder=" "
                                />
                                <label
                                    className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                                        email.trim().length > 0 || touched.login
                                            ? 'top-2 text-[11px] text-gray-500'
                                            : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400'
                                    } ${hasLoginError ? 'text-[#FF5C5C]' : ''}`}
                                >
                                    Email
                                </label>
                            </div>
                            <div className="min-h-[20px] mt-1.5">
                                {hasLoginError && (
                                    <span className="text-[11px] text-[#FF5C5C] ml-1 block font-medium">
                                        {loginError}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                    disabled={isLoading}
                                    className={`w-full pl-4 pr-12 pt-6 pb-3 rounded-[16px] outline-none text-[14px] border-2 transition-all ${
                                        hasPasswordError
                                            ? 'border-[#FF8A8A] bg-[#FFF5F5]'
                                            : 'border-transparent bg-[#F5F5F5]'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder=" "
                                />
                                <label
                                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                        password.length > 0 || touched.password
                                            ? 'top-2 text-[11px] text-gray-500'
                                            : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400'
                                    } ${hasPasswordError ? 'text-[#FF5C5C]' : ''}`}
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none z-10"
                                >
                                    <img
                                        src={
                                            showPassword
                                                ? eyeOpenIcon
                                                : eyeClosedIcon
                                        }
                                        alt=""
                                        className="w-5 h-5 opacity-40 hover:opacity-100"
                                    />
                                </button>
                            </div>
                            <div className="min-h-[20px] mt-1.5">
                                {hasPasswordError && (
                                    <span className="text-[11px] text-[#FF5C5C] ml-1 block font-medium">
                                        {passwordError}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="keep-logged"
                                type="checkbox"
                                defaultChecked
                                className="w-4 h-4 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="keep-logged"
                                className="ml-2 text-sm text-gray-600 cursor-pointer"
                            >
                                Keep me logged in
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#D7FF82] hover:bg-[#cbf475] text-black font-bold rounded-[16px] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            {[
                                { id: 'google', icon: googleIcon },
                                { id: 'fb', icon: fbIcon },
                                { id: 'apple', icon: appleIcon },
                            ].map((social) => (
                                <button
                                    key={social.id}
                                    type="button"
                                    className="flex-1 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <img
                                        src={social.icon}
                                        alt={social.id}
                                        className="w-5 h-5"
                                    />
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline text-center"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

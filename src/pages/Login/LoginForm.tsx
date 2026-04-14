import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api-user/api-user';
import {
    setAccessToken,
    setRefreshToken,
    setUserEmail,
    setUserId,
} from '../../common/utils/localStorage';

import googleIcon from '../../assets/icons/google.svg';
import fbIcon from '../../assets/icons/facebook.svg';
import appleIcon from '../../assets/icons/apple.svg';
import lockIcon from '../../assets/icons/lock.svg';
import userIcon from '../../assets/icons/login-user.svg';
import eyeClosedIcon from '../../assets/icons/eye-closed.svg';
import eyeOpenIcon from '../../assets/icons/eye-open.svg';

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
    const [isFocused, setIsFocused] = useState<{
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
        setIsFocused((prev) => ({ ...prev, login: false }));
        setTouched((prev) => ({ ...prev, login: true }));
        setLoginError(validateLogin(email));
    };

    const handlePasswordBlur = () => {
        setIsFocused((prev) => ({ ...prev, password: false }));
        setTouched((prev) => ({ ...prev, password: true }));
        setPasswordError(validatePassword(password));
    };

    const handleLoginFocus = () => {
        setIsFocused((prev) => ({ ...prev, login: true }));
    };

    const handlePasswordFocus = () => {
        setIsFocused((prev) => ({ ...prev, password: true }));
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

            if (response) {
                const { accessToken, refreshToken } = response;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setUserEmail(email);

                try {
                    const payload = JSON.parse(atob(accessToken.split('.')[1]));
                    if (payload.id) {
                        setUserId(payload.id);
                    }
                } catch {
                    // Ignore token parsing errors
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

    const hasLoginValue = email.trim().length > 0;
    const hasPasswordValue = password.length > 0;
    const showLoginLabel = hasLoginValue || isFocused.login || touched.login;
    const showPasswordLabel =
        hasPasswordValue || isFocused.password || touched.password;
    const hasLoginError = loginError && touched.login;
    const hasPasswordError = passwordError && touched.password;

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F4F7F2] w-full p-4">
            <div className="bg-white shadow-sm rounded-[36px] w-full max-w-146.25 p-15 md:p-25 flex flex-col gap-10">
                <div className="text-center shrink-0">
                    <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
                        Hi, Welcome Back
                    </h1>
                    <p className="text-[14px] text-gray-900 mt-2">
                        Please sign in!
                    </p>
                </div>

                <form
                    className="flex flex-col gap-5 shrink-0"
                    onSubmit={handleSubmit}
                >
                    <div className="relative">
                        <div className="relative group rounded-2xl p-0.5 overflow-hidden">
                            <div
                                className={`absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#D7FF82_100%)] transition-opacity duration-300 ${isFocused.login ? 'opacity-100' : 'opacity-50'}`}
                            />
                            <div
                                className={`relative w-full rounded-[14px] transition-all duration-300 backdrop-blur-sm bg-linear-to-r from-black/40 to-black/20 hover:shadow-[0_0_12px_rgba(215,255,130,0.5)] ${isFocused.login ? 'shadow-[0_0_12px_#D7FF82]' : ''}`}
                            >
                                <img
                                    src={userIcon}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70 z-10 invert brightness-200"
                                    alt=""
                                />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={handleLoginChange}
                                    onBlur={handleLoginBlur}
                                    onFocus={handleLoginFocus}
                                    disabled={isLoading}
                                    className={`w-full pl-12 pr-4 pt-6 pb-3 rounded-[14px] outline-none text-[14px] text-white bg-transparent border-2 transition-all relative z-10 ${
                                        hasLoginError
                                            ? 'border-[#FF8A8A]'
                                            : 'border-transparent'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder=" "
                                />
                                <label
                                    className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                                        showLoginLabel
                                            ? 'top-2 text-[11px] text-[#D7FF82]'
                                            : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-300'
                                    } ${hasLoginError ? 'text-[#FF5C5C]' : ''}`}
                                >
                                    Login
                                </label>
                            </div>
                        </div>
                        <div className="min-h-5 mt-1.5">
                            {hasLoginError && (
                                <span className="text-[11px] text-[#FF5C5C] ml-1 block font-medium">
                                    {loginError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative group rounded-2xl p-0.5 overflow-hidden">
                            <div
                                className={`absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#D7FF82_100%)] transition-opacity duration-300 ${isFocused.password ? 'opacity-100' : 'opacity-50'}`}
                            />
                            <div
                                className={`relative w-full rounded-[14px] transition-all duration-300 backdrop-blur-sm bg-linear-to-r from-black/40 to-black/20 hover:shadow-[0_0_12px_rgba(215,255,130,0.5)] ${isFocused.password ? 'shadow-[0_0_12px_#D7FF82]' : ''}`}
                            >
                                <img
                                    src={lockIcon}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70 z-10 invert brightness-200"
                                    alt=""
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                    onFocus={handlePasswordFocus}
                                    disabled={isLoading}
                                    className={`w-full pl-12 pr-12 pt-6 pb-3 rounded-[14px] outline-none text-[14px] text-white bg-transparent border-2 transition-all relative z-10 ${
                                        hasPasswordError
                                            ? 'border-[#FF8A8A]'
                                            : 'border-transparent'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder=" "
                                />
                                <label
                                    className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                                        showPasswordLabel
                                            ? 'top-2 text-[11px] text-[#D7FF82]'
                                            : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-300'
                                    } ${hasPasswordError ? 'text-[#FF5C5C]' : ''}`}
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none z-20"
                                >
                                    <img
                                        src={
                                            showPassword
                                                ? eyeOpenIcon
                                                : eyeClosedIcon
                                        }
                                        alt=""
                                        className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity invert brightness-200"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="min-h-5 mt-1.5">
                            {hasPasswordError && (
                                <span className="text-[11px] text-[#FF5C5C] ml-1 block font-medium">
                                    {passwordError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="keep-logged"
                                type="checkbox"
                                defaultChecked
                                className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                            <label
                                htmlFor="keep-logged"
                                className="ml-2 text-[13px] text-gray-500 cursor-pointer select-none"
                            >
                                Keep me logged in
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#D7FF82] hover:bg-[#cbf475] text-black font-bold rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="flex flex-col gap-4 flex-shrink-0">
                    <div className="flex gap-3 w-full">
                        {[
                            { id: 'google', icon: googleIcon },
                            { id: 'fb', icon: fbIcon },
                            { id: 'apple', icon: appleIcon },
                        ].map((social) => (
                            <button
                                key={social.id}
                                type="button"
                                className="flex-1 h-[48px] bg-[#F5F5F5] rounded-[12px] flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors underline text-left"
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

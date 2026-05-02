import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/api-user/api-user';

import googleIcon from '../../../assets/icons/google.svg';
import fbIcon from '../../../assets/icons/facebook.svg';
import appleIcon from '../../../assets/icons/apple.svg';
import lockIcon from '../../../assets/icons/lock.svg';
import userIcon from '../../../assets/icons/login-user.svg';
import eyeClosedIcon from '../../../assets/icons/eye-closed.svg';
import eyeOpenIcon from '../../../assets/icons/eye-open.svg';

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] =
        useState<string>('');
    const [touched, setTouched] = useState<{
        email: boolean;
        password: boolean;
        confirmPassword: boolean;
    }>({
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [isFocused, setIsFocused] = useState<{
        email: boolean;
        password: boolean;
        confirmPassword: boolean;
    }>({
        email: false,
        password: false,
        confirmPassword: false,
    });

    const validateEmail = (value: string): string => {
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
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const validateConfirmPassword = (value: string): string => {
        if (!value) {
            return 'Required field';
        }
        if (value !== password) {
            return 'Passwords do not match';
        }
        return '';
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (touched.email) {
            setEmailError(validateEmail(value));
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (touched.password) {
            setPasswordError(validatePassword(value));
        }
        if (touched.confirmPassword && confirmPassword) {
            setConfirmPasswordError(
                value !== confirmPassword ? 'Passwords do not match' : '',
            );
        }
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (touched.confirmPassword) {
            setConfirmPasswordError(validateConfirmPassword(value));
        }
    };

    const handleEmailBlur = () => {
        setIsFocused((prev) => ({ ...prev, email: false }));
        setTouched((prev) => ({ ...prev, email: true }));
        setEmailError(validateEmail(email));
    };

    const handlePasswordBlur = () => {
        setIsFocused((prev) => ({ ...prev, password: false }));
        setTouched((prev) => ({ ...prev, password: true }));
        setPasswordError(validatePassword(password));
    };

    const handleConfirmPasswordBlur = () => {
        setIsFocused((prev) => ({ ...prev, confirmPassword: false }));
        setTouched((prev) => ({ ...prev, confirmPassword: true }));
        setConfirmPasswordError(validateConfirmPassword(confirmPassword));
    };

    const handleEmailFocus = () => {
        setIsFocused((prev) => ({ ...prev, email: true }));
    };

    const handlePasswordFocus = () => {
        setIsFocused((prev) => ({ ...prev, password: true }));
    };

    const handleConfirmPasswordFocus = () => {
        setIsFocused((prev) => ({ ...prev, confirmPassword: true }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newEmailError = validateEmail(email);
        const newPasswordError = validatePassword(password);
        const newConfirmPasswordError =
            validateConfirmPassword(confirmPassword);

        setEmailError(newEmailError);
        setPasswordError(newPasswordError);
        setConfirmPasswordError(newConfirmPasswordError);
        setTouched({ email: true, password: true, confirmPassword: true });

        if (!newEmailError && !newPasswordError && !newConfirmPasswordError) {
            const { response, error } = await register({
                email,
                password,
                confirmPassword,
                firstName: '',
                lastName: '',
                gender: 'male',
                dateOfBirth: '',
                position: '',
                hireDate: '',
                phone: '',
                role: 'user',
            });

            if (response) {
                navigate('/login');
            } else {
                setEmailError(
                    error?.message || 'Registration failed. Please try again.',
                );
            }
        }
    };

    const hasEmailValue = email.trim().length > 0;
    const hasPasswordValue = password.length > 0;
    const hasConfirmPasswordValue = confirmPassword.length > 0;
    const showEmailLabel = hasEmailValue || isFocused.email || touched.email;
    const showPasswordLabel =
        hasPasswordValue || isFocused.password || touched.password;
    const showConfirmPasswordLabel =
        hasConfirmPasswordValue ||
        isFocused.confirmPassword ||
        touched.confirmPassword;
    const hasEmailError = emailError && touched.email;
    const hasPasswordError = passwordError && touched.password;
    const hasConfirmPasswordError =
        confirmPasswordError && touched.confirmPassword;

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F4F7F2] w-full">
            <div
                className="bg-white shadow-sm flex flex-col justify-between"
                style={{
                    width: '585px',
                    minHeight: '636px',
                    borderRadius: '36px',
                    padding: '100px',
                    gap: '40px',
                }}
            >
                <div className="text-center">
                    <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
                        Create Account
                    </h1>
                    <p className="text-[14px] text-gray-900 mt-2">
                        Please sign up to continue
                    </p>
                </div>

                <form
                    className="flex flex-col"
                    style={{ gap: '20px' }}
                    onSubmit={handleSubmit}
                >
                    <div className="relative">
                        <div className="relative">
                            <img
                                src={userIcon}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 z-10"
                                alt=""
                            />
                            <input
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                                onFocus={handleEmailFocus}
                                className={`w-full pl-12 pr-4 pt-6 pb-3 rounded-[16px] outline-none text-[14px] border-2 transition-all ${
                                    hasEmailError
                                        ? 'border-[#FF8A8A] bg-[#FFF5F5]'
                                        : isFocused.email
                                          ? 'border-gray-300 bg-white'
                                          : 'border-transparent bg-[#F5F5F5]'
                                }`}
                                placeholder=" "
                            />
                            <label
                                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                                    showEmailLabel
                                        ? 'top-2 text-[11px] text-gray-500'
                                        : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400'
                                } ${hasEmailError ? 'text-[#FF5C5C]' : ''}`}
                            >
                                Email
                            </label>
                            {hasEmailError && (
                                <span className="text-[11px] text-[#FF5C5C] ml-1 mt-1.5 block font-medium">
                                    {emailError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative">
                            <img
                                src={lockIcon}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 z-10"
                                alt=""
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                onFocus={handlePasswordFocus}
                                className={`w-full pl-12 pr-12 pt-6 pb-3 rounded-[16px] outline-none text-[14px] border-2 transition-all ${
                                    hasPasswordError
                                        ? 'border-[#FF8A8A] bg-[#FFF5F5]'
                                        : isFocused.password
                                          ? 'border-gray-300 bg-white'
                                          : 'border-transparent bg-[#F5F5F5]'
                                }`}
                                placeholder=" "
                            />
                            <label
                                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                                    showPasswordLabel
                                        ? 'top-2 text-[11px] text-gray-500'
                                        : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400'
                                } ${hasPasswordError ? 'text-[#FF5C5C]' : ''}`}
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none z-10"
                            >
                                <img
                                    src={
                                        showPassword
                                            ? eyeOpenIcon
                                            : eyeClosedIcon
                                    }
                                    alt=""
                                    className="w-5 h-5 opacity-40 hover:opacity-60 transition-opacity"
                                />
                            </button>
                            {hasPasswordError && (
                                <span className="text-[11px] text-[#FF5C5C] ml-1 mt-1.5 block font-medium">
                                    {passwordError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative">
                            <img
                                src={lockIcon}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 z-10"
                                alt=""
                            />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onBlur={handleConfirmPasswordBlur}
                                onFocus={handleConfirmPasswordFocus}
                                className={`w-full pl-12 pr-12 pt-6 pb-3 rounded-[16px] outline-none text-[14px] border-2 transition-all ${
                                    hasConfirmPasswordError
                                        ? 'border-[#FF8A8A] bg-[#FFF5F5]'
                                        : isFocused.confirmPassword
                                          ? 'border-gray-300 bg-white'
                                          : 'border-transparent bg-[#F5F5F5]'
                                }`}
                                placeholder=" "
                            />
                            <label
                                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                                    showConfirmPasswordLabel
                                        ? 'top-2 text-[11px] text-gray-500'
                                        : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400'
                                } ${hasConfirmPasswordError ? 'text-[#FF5C5C]' : ''}`}
                            >
                                Confirm Password
                            </label>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none z-10"
                            >
                                <img
                                    src={
                                        showConfirmPassword
                                            ? eyeOpenIcon
                                            : eyeClosedIcon
                                    }
                                    alt=""
                                    className="w-5 h-5 opacity-40 hover:opacity-60 transition-opacity"
                                />
                            </button>
                            {hasConfirmPasswordError && (
                                <span className="text-[11px] text-[#FF5C5C] ml-1 mt-1.5 block font-medium">
                                    {confirmPasswordError}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-[#D7FF82] hover:bg-[#cbf475] text-black font-bold rounded-[16px] transition-all shadow-sm"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="flex flex-col gap-4">
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
                        onClick={() => navigate('/login')}
                        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors underline text-left"
                    >
                        Already have an account? Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;

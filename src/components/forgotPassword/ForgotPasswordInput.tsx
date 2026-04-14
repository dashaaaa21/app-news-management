import React from 'react';
import type { ChangeEvent } from 'react';
import userIcon from '../../assets/icons/login-user.svg';

interface ForgotPasswordInputProps {
    email: string;
    emailError: string;
    successMessage: string;
    isFocused: boolean;
    touched: boolean;
    isLoading: boolean;
    onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onEmailBlur: () => void;
    onEmailFocus: () => void;
}

const ForgotPasswordInput: React.FC<ForgotPasswordInputProps> = ({
    email,
    emailError,
    successMessage,
    isFocused,
    touched,
    isLoading,
    onEmailChange,
    onEmailBlur,
    onEmailFocus,
}) => {
    const hasEmailValue = email.trim().length > 0;
    const showEmailLabel = hasEmailValue || isFocused || touched;
    const hasEmailError = emailError && touched;

    return (
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
                    onChange={onEmailChange}
                    onBlur={onEmailBlur}
                    onFocus={onEmailFocus}
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 pt-6 pb-3 rounded-[16px] outline-none text-[14px] border-2 transition-all ${
                        hasEmailError
                            ? 'border-[#FF8A8A] bg-[#FFF5F5]'
                            : isFocused
                              ? 'border-gray-300 bg-white'
                              : 'border-transparent bg-[#F5F5F5]'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            </div>
            <div className="min-h-[20px] mt-1.5">
                {hasEmailError && (
                    <span className="text-[11px] text-[#FF5C5C] ml-1 block font-medium">
                        {emailError}
                    </span>
                )}
                {successMessage && (
                    <span className="text-[11px] text-green-600 ml-1 block font-medium">
                        {successMessage}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordInput;

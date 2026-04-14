import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/api-user/api-user';
import ForgotPasswordHeader from '../../components/forgotPassword/ForgotPasswordHeader';
import ForgotPasswordInput from '../../components/forgotPassword/ForgotPasswordInput';
import ForgotPasswordButton from '../../components/forgotPassword/ForgotPasswordButton';
import ForgotPasswordReminder from '../../components/forgotPassword/ForgotPasswordReminder';

const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [touched, setTouched] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

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

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (touched) {
            setEmailError(validateEmail(value));
        }
    };

    const handleEmailBlur = () => {
        setIsFocused(false);
        setTouched(true);
        setEmailError(validateEmail(email));
    };

    const handleEmailFocus = () => {
        setIsFocused(true);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newEmailError = validateEmail(email);
        setEmailError(newEmailError);
        setTouched(true);

        if (!newEmailError) {
            setIsLoading(true);
            setSuccessMessage('');
            const { response, error } = await forgotPassword(email);

            if (response) {
                setSuccessMessage('Password reset link sent to your email');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setEmailError(
                    (error?.response?.data as { message?: string })?.message ||
                        error?.message ||
                        'Failed to send reset link',
                );
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-DEFAULT w-full p-4 overflow-hidden">
            <div className="relative w-full max-w-[585px] rounded-[36px] overflow-hidden p-[4px] shadow-sm">
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_120deg,#D7FF82_180deg,transparent_180deg_300deg,#D7FF82_360deg)] animate-[spin_4s_linear_infinite]"></div>

                <div className="relative z-10 bg-white rounded-[32px] w-full h-full p-[60px] md:p-[100px] flex flex-col gap-10">
                    <ForgotPasswordHeader />

                    <form
                        className="flex flex-col gap-5 flex-shrink-0"
                        onSubmit={handleSubmit}
                    >
                        <ForgotPasswordInput
                            email={email}
                            emailError={emailError}
                            successMessage={successMessage}
                            isFocused={isFocused}
                            touched={touched}
                            isLoading={isLoading}
                            onEmailChange={handleEmailChange}
                            onEmailBlur={handleEmailBlur}
                            onEmailFocus={handleEmailFocus}
                        />

                        <ForgotPasswordButton isLoading={isLoading} />
                    </form>

                    <ForgotPasswordReminder />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;

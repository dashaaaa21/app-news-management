import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordReminder: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-4 flex-shrink-0">
            <p className="text-[12px] text-[#FF5C5C] text-center font-medium">
                REMINDER! You should change password in my profile
            </p>
            <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors underline text-center"
            >
                Back to Sign In
            </button>
        </div>
    );
};

export default ForgotPasswordReminder;

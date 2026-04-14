import React from 'react';

interface ForgotPasswordButtonProps {
    isLoading: boolean;
}

const ForgotPasswordButton: React.FC<ForgotPasswordButtonProps> = ({
    isLoading,
}) => {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#D7FF82] hover:bg-[#cbf475] text-black font-bold rounded-[16px] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
    );
};

export default ForgotPasswordButton;

import React from 'react';

const ForgotPasswordHeader: React.FC = () => {
    return (
        <div className="text-center flex-shrink-0">
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
                Forgot Password?
            </h1>
            <p className="text-[14px] text-gray-900 mt-2">
                Enter your email to reset password
            </p>
        </div>
    );
};

export default ForgotPasswordHeader;

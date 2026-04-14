import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';

const ChangePasswordLink: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-gray-400 hover:text-gray-900 underline transition-all px-2 py-1 rounded hover:bg-gray-50"
            >
                Change Password
            </button>
            <ChangePasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default ChangePasswordLink;

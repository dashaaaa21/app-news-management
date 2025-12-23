import React from 'react';

interface ProfileFormInputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string;
}

const ProfileFormInput: React.FC<ProfileFormInputProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
}) => {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-[16px] bg-white border outline-none transition-all shadow-sm text-gray-900 placeholder:text-gray-400 ${
                    error
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-gray-300 focus:border-gray-400'
                }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default ProfileFormInput;

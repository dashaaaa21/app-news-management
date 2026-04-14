import type { IUser } from './user-type';
import type { INews } from './news-type';

export interface IProfileAvatarProps {
    currentPhoto?: string;
    onPhotoChange?: (photoUrl: string) => void;
}

export interface IProfileAvatarSectionProps {
    currentPhoto?: string;
    onPhotoChange?: (photoUrl: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export interface IProfileAvatarActionsProps {
    onSave: () => void;
    onCancel: () => void;
}

export interface IProfileFormActionsProps {
    onSave: () => void;
    isLoading?: boolean;
}

export interface IProfileFormInputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
}

export interface IChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface IForgotPasswordButtonProps {
    isLoading: boolean;
}

export interface IForgotPasswordInputProps {
    email: string;
    emailError: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IUserTableRowProps {
    user: IUser;
    isSelected: boolean;
    onSelect: (userId: number) => void;
    onEdit: (user: IUser) => void;
    onDelete: (userId: number) => void;
}

export interface IViewUserModalProps {
    user: IUser;
    onClose: () => void;
}

export interface IUsersTableProps {
    users: IUser[];
    selectedUsers: number[];
    onSelectedUsersChange: (users: number[]) => void;
    isLoading: boolean;
}

export interface IUsersTableHeaderProps {
    isAllSelected: boolean;
    onSelectAll: () => void;
}

export interface IProfileHeaderProps {
    selectedUsers: number[];
    onClearSelection: () => void;
    onCreateUser: () => void;
    onDeleteSelected: () => void;
}

export interface INewsGridProps {
    news: INews[];
}

export interface INewsCardProps {
    news: INews;
}

export interface IArrowDownProps {
    className?: string;
}

export interface IUserFormHeaderProps {
    title?: string;
}

export interface IFormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?:
        | 'text'
        | 'email'
        | 'password'
        | 'tel'
        | 'date'
        | 'select'
        | 'textarea';
    placeholder?: string;
    error?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    rows?: number;
}

export interface IProfileFormFieldsProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        gender: 'male' | 'female' | 'other';
        dateOfBirth: string;
        position: string;
        hireDate: string;
        phone: string;
        bio: string;
        role: 'admin' | 'user' | 'manager';
    };
    errors?: Record<string, string>;
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => void;
}

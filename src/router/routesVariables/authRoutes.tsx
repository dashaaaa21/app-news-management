import type { RouteObject } from 'react-router-dom';
import { authRoutesVariables } from './pathVariables';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';

// TODO: Create separate Login and Register page components
export const authRoutes: RouteObject[] = [
    {
        path: authRoutesVariables.login,
        element: <AuthLayout />,
    },
    {
        path: authRoutesVariables.register,
        element: <AuthLayout />,
    },
    {
        path: authRoutesVariables.forgotPassword,
        element: <ForgotPassword />,
    },
];

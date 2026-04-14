import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import NotFound from '../pages/NotFound/NotFound';
import { authRoutes } from './routesVariables/authRoutes';
import { adminPrivateRoutes } from './routesVariables/adminPrivateRoutes';
import { managerPrivateRoutes } from './routesVariables/managerPrivateRoutes';
import { reporterPrivateRoutes } from './routesVariables/reporterPrivateRoutes';
import { RequireAuth } from './RequireAuth';

export const router = createBrowserRouter([
    {
        errorElement: <NotFound />,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" replace />,
            },
            {
                children: [...authRoutes],
            },
            {
                element: (
                    <RequireAuth>
                        <AdminLayout />
                    </RequireAuth>
                ),
                children: [
                    ...adminPrivateRoutes,
                    ...managerPrivateRoutes,
                    ...reporterPrivateRoutes,
                ],
            },
        ],
    },
]);

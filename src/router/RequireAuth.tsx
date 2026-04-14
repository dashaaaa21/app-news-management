import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getAccessToken } from '../common/utils/localStorage';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
    const isAuth = getAccessToken() !== null;
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

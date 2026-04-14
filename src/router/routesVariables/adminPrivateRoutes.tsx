import type { RouteObject } from 'react-router-dom';
import { adminPrivateRoutesVariables } from './pathVariables';
import AdminProfiles from '../../pages/adminProfiles/adminProfiles';
import Users from '../../pages/Users/Users';
import CreateUser from '../../pages/Users/CreateUser';
import EditUser from '../../pages/Users/EditUser';
import MyProfile from '../../pages/MyProfile/MyProfile';
import News from '../../pages/News/News';
import NewsDetail from '../../pages/NewsDetail/NewsDetail';
import Dashboard from '../../components/Dashboard/Dashboard';

export const adminPrivateRoutes: RouteObject[] = [
    {
        path: adminPrivateRoutesVariables.dashboard,
        element: <Dashboard />,
    },
    {
        path: adminPrivateRoutesVariables.users,
        element: <Users />,
    },
    {
        path: adminPrivateRoutesVariables.createUser,
        element: <CreateUser />,
    },
    {
        path: adminPrivateRoutesVariables.editUser,
        element: <EditUser />,
    },
    {
        path: adminPrivateRoutesVariables.adminProfiles,
        element: <AdminProfiles />,
    },
    {
        path: adminPrivateRoutesVariables.news,
        element: <News />,
    },
    {
        path: adminPrivateRoutesVariables.editNews,
        element: <NewsDetail />,
    },
    {
        path: adminPrivateRoutesVariables.newsDetail,
        element: <NewsDetail />,
    },
    {
        path: adminPrivateRoutesVariables.settings,
        element: <MyProfile />,
    },
    {
        path: adminPrivateRoutesVariables.calendar,
        element: <div>Calendar</div>,
    },
];

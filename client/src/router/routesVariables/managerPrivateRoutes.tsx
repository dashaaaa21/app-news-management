import type { RouteObject } from 'react-router-dom';
import { managerPrivateRoutesVariables } from './pathVariables';
import ManagerProfiles from '../../pages/managerProfiles/managerProfiles';
import MyProfile from '../../pages/MyProfile/MyProfile';
import News from '../../pages/News/News';
import NewsDetail from '../../pages/NewsDetail/NewsDetail';
import Dashboard from '../../components/Dashboard/Dashboard';

export const managerPrivateRoutes: RouteObject[] = [
    {
        path: managerPrivateRoutesVariables.dashboard,
        element: <Dashboard />,
    },
    {
        path: managerPrivateRoutesVariables.managerProfiles,
        element: <ManagerProfiles />,
    },
    {
        path: managerPrivateRoutesVariables.news,
        element: <News />,
    },
    {
        path: managerPrivateRoutesVariables.newsDetail,
        element: <NewsDetail />,
    },
    {
        path: managerPrivateRoutesVariables.settings,
        element: <MyProfile />,
    },
    {
        path: managerPrivateRoutesVariables.calendar,
        element: <div>Calendar</div>,
    },
];

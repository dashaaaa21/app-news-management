import type { RouteObject } from 'react-router-dom';
import { reporterPrivateRoutesVariables } from './pathVariables';
import ReporterProfiles from '../../pages/reporterProfiles/reporterProfiles';
import MyProfile from '../../pages/MyProfile/MyProfile';
import News from '../../pages/News/News';
import NewsDetail from '../../pages/NewsDetail/NewsDetail';
import Dashboard from '../../components/Dashboard/Dashboard';

export const reporterPrivateRoutes: RouteObject[] = [
    {
        path: reporterPrivateRoutesVariables.dashboard,
        element: <Dashboard />,
    },
    {
        path: reporterPrivateRoutesVariables.reporterProfiles,
        element: <ReporterProfiles />,
    },
    {
        path: reporterPrivateRoutesVariables.news,
        element: <News />,
    },
    {
        path: reporterPrivateRoutesVariables.editNews,
        element: <NewsDetail />,
    },
    {
        path: reporterPrivateRoutesVariables.newsDetail,
        element: <NewsDetail />,
    },
    {
        path: reporterPrivateRoutesVariables.settings,
        element: <MyProfile />,
    },
    {
        path: reporterPrivateRoutesVariables.calendar,
        element: <div>Calendar</div>,
    },
];

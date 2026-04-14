import type { ReactElement } from 'react';
import { adminPrivateRoutesVariables } from './routesVariables/pathVariables';
import ChartDonutIcon from '../components/icons/ChartDonutIcon';
import UserIcon from '../components/icons/UserIcon';
import BoxIcon from '../components/icons/BoxIcon';
import SettingsIcon from '../components/icons/SettingsIcon';
import CalendarIcon from '../components/icons/CalendarIcon';

export interface ISidebarRoute {
    name: string;
    icon: ReactElement;
    path: string;
}

export const sidebarRoutes: ISidebarRoute[] = [
    {
        name: 'Dashboards',
        icon: <ChartDonutIcon />,
        path: adminPrivateRoutesVariables.dashboard,
    },
    {
        name: 'Users',
        icon: <UserIcon />,
        path: adminPrivateRoutesVariables.users,
    },
    {
        name: 'All news',
        icon: <BoxIcon />,
        path: adminPrivateRoutesVariables.news,
    },
    {
        name: 'Settings',
        icon: <SettingsIcon />,
        path: adminPrivateRoutesVariables.settings,
    },
    {
        name: 'Calendar',
        icon: <CalendarIcon />,
        path: adminPrivateRoutesVariables.calendar,
    },
];

import type { JSX } from 'react';

export interface IAdminRouter {
    name: string;
    icon?: JSX.Element;
    page: JSX.Element;
    path: string;
    layout: string;
    role: string[];
}

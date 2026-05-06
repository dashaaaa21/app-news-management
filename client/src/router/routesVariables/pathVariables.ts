export const authRoutesVariables = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
};

export const adminPrivateRoutesVariables = {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    createUser: '/admin/users/create',
    adminProfiles: '/admin/profiles',
    editUser: '/admin/user/edit/:id',
    news: '/admin/staff-news',
    newsDetail: '/admin/staff-news/:id',
    editNews: '/admin/staff-news/:id/edit',
    settings: '/admin/settings',
    calendar: '/admin/calendar',
};

export const managerPrivateRoutesVariables = {
    dashboard: '/manager/dashboard',
    managerProfiles: '/manager/profiles',
    news: '/manager/staff-news',
    newsDetail: '/manager/staff-news/:id',
    settings: '/manager/settings',
    calendar: '/manager/calendar',
};

export const reporterPrivateRoutesVariables = {
    dashboard: '/reporter/dashboard',
    reporterProfiles: '/reporter/profiles',
    news: '/reporter/staff-news',
    newsDetail: '/reporter/staff-news/:id',
    editNews: '/reporter/staff-news/:id/edit',
    settings: '/reporter/settings',
    calendar: '/reporter/calendar',
};

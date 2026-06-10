import React from 'react';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig';

export const publicRoutes = [
  {
    key: 'login',
    path: `${AUTH_PREFIX_PATH}/login`,
    component: React.lazy(() => import('views/auth-views/authentication/login')),
  },
  {
    key: 'register',
    path: `${AUTH_PREFIX_PATH}/register-1`,
    component: React.lazy(() => import('views/auth-views/authentication/register-1')),
  },
  {
    key: 'forgot-password',
    path: `${AUTH_PREFIX_PATH}/forgot-password`,
    component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
  },
  {
    key: 'error-page-1',
    path: `${AUTH_PREFIX_PATH}/error-page-1`,
    component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
  },
  {
    key: 'error-page-2',
    path: `${AUTH_PREFIX_PATH}/error-page-2`,
    component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
  },
];

export const protectedRoutes = [
  {
    key: 'dashboard',
    path: `${APP_PREFIX_PATH}/dashboard`,
    component: React.lazy(() => import('views/app-views/dashboard')),
  },
  {
    key: 'onboarding',
    path: `${APP_PREFIX_PATH}/onboarding`,
    component: React.lazy(() => import('views/app-views/onboarding')),
    meta: { blankLayout: true },
  },
  {
    key: 'profile',
    path: `${APP_PREFIX_PATH}/profile`,
    component: React.lazy(() => import('views/app-views/profile')),
  },
  {
    key: 'exercises',
    path: `${APP_PREFIX_PATH}/exercises`,
    component: React.lazy(() => import('views/app-views/exercises')),
  },
  {
    key: 'progress',
    path: `${APP_PREFIX_PATH}/progress`,
    component: React.lazy(() => import('views/app-views/progress')),
  },
  {
    key: 'students',
    path: `${APP_PREFIX_PATH}/students`,
    component: React.lazy(() => import('views/app-views/students')),
  },
  {
    key: 'content',
    path: `${APP_PREFIX_PATH}/content`,
    component: React.lazy(() => import('views/app-views/content')),
  },
  {
    key: 'users',
    path: `${APP_PREFIX_PATH}/users`,
    component: React.lazy(() => import('views/app-views/admin-users')),
  },
  {
    key: 'settings',
    path: `${APP_PREFIX_PATH}/settings`,
    component: React.lazy(() => import('views/app-views/settings')),
  },
];

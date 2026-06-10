import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from 'constants/ThemeConstant';

export const APP_NAME = 'GLS';
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const REDIRECT_URL_KEY = 'redirect';
export const AUTHENTICATED_ENTRY = `${APP_PREFIX_PATH}/dashboard`;
export const UNAUTHENTICATED_ENTRY = '/login';

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: 'en',
  navType: NAV_TYPE_SIDE,
  topNavColor: '#3e82f7',
  headerNavColor: '',
  mobileNav: false,
  currentTheme: 'light',
  direction: DIR_LTR,
  blankLayout: false,
};

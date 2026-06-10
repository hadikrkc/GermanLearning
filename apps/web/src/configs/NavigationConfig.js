import {
  DashboardOutlined,
  BookOutlined,
  LineChartOutlined,
  UserOutlined,
  TeamOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const studentNav = [
  {
    key: 'student',
    path: `${APP_PREFIX_PATH}/dashboard`,
    title: 'sidenav.dashboard',
    icon: DashboardOutlined,
    breadcrumb: false,
    isGroupTitle: true,
    roles: ['STUDENT'],
    submenu: [
      {
        key: 'student-dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        title: 'sidenav.dashboard',
        icon: DashboardOutlined,
        breadcrumb: false,
        roles: ['STUDENT'],
        submenu: [],
      },
      {
        key: 'student-exercises',
        path: `${APP_PREFIX_PATH}/exercises`,
        title: 'sidenav.exercises',
        icon: BookOutlined,
        breadcrumb: true,
        roles: ['STUDENT'],
        submenu: [],
      },
      {
        key: 'student-progress',
        path: `${APP_PREFIX_PATH}/progress`,
        title: 'sidenav.progress',
        icon: LineChartOutlined,
        breadcrumb: true,
        roles: ['STUDENT'],
        submenu: [],
      },
      {
        key: 'student-profile',
        path: `${APP_PREFIX_PATH}/profile`,
        title: 'sidenav.profile',
        icon: UserOutlined,
        breadcrumb: false,
        roles: ['STUDENT'],
        submenu: [],
      },
    ],
  },
];

const teacherNav = [
  {
    key: 'teacher',
    path: `${APP_PREFIX_PATH}/dashboard`,
    title: 'sidenav.dashboard',
    icon: DashboardOutlined,
    breadcrumb: false,
    isGroupTitle: true,
    roles: ['TEACHER'],
    submenu: [
      {
        key: 'teacher-dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        title: 'sidenav.dashboard',
        icon: DashboardOutlined,
        breadcrumb: false,
        roles: ['TEACHER'],
        submenu: [],
      },
      {
        key: 'teacher-students',
        path: `${APP_PREFIX_PATH}/students`,
        title: 'sidenav.students',
        icon: TeamOutlined,
        breadcrumb: true,
        roles: ['TEACHER'],
        submenu: [],
      },
      {
        key: 'teacher-content',
        path: `${APP_PREFIX_PATH}/content`,
        title: 'sidenav.content',
        icon: EditOutlined,
        breadcrumb: true,
        roles: ['TEACHER'],
        submenu: [],
      },
      {
        key: 'teacher-profile',
        path: `${APP_PREFIX_PATH}/profile`,
        title: 'sidenav.profile',
        icon: UserOutlined,
        breadcrumb: false,
        roles: ['TEACHER'],
        submenu: [],
      },
    ],
  },
];

const adminNav = [
  {
    key: 'admin',
    path: `${APP_PREFIX_PATH}/dashboard`,
    title: 'sidenav.dashboard',
    icon: DashboardOutlined,
    breadcrumb: false,
    isGroupTitle: true,
    roles: ['ADMIN'],
    submenu: [
      {
        key: 'admin-dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        title: 'sidenav.dashboard',
        icon: DashboardOutlined,
        breadcrumb: false,
        roles: ['ADMIN'],
        submenu: [],
      },
      {
        key: 'admin-users',
        path: `${APP_PREFIX_PATH}/users`,
        title: 'sidenav.users',
        icon: TeamOutlined,
        breadcrumb: true,
        roles: ['ADMIN'],
        submenu: [],
      },
      {
        key: 'admin-content',
        path: `${APP_PREFIX_PATH}/content`,
        title: 'sidenav.content',
        icon: BookOutlined,
        breadcrumb: true,
        roles: ['ADMIN'],
        submenu: [],
      },
      {
        key: 'admin-settings',
        path: `${APP_PREFIX_PATH}/settings`,
        title: 'sidenav.settings',
        icon: SettingOutlined,
        breadcrumb: true,
        roles: ['ADMIN'],
        submenu: [],
      },
    ],
  },
];

const navigationConfig = [...studentNav, ...teacherNav, ...adminNav];

export default navigationConfig;

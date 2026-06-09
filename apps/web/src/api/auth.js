import { api } from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};

export const userApi = {
  getMe: () => api.get('/users/me').then((r) => r.data),
  updateMe: (data) => api.patch('/users/me', data).then((r) => r.data),
  changePassword: (data) => api.post('/users/me/change-password', data).then((r) => r.data),
  deactivate: () => api.delete('/users/me').then((r) => r.data),
  getLoginHistory: () => api.get('/users/me/login-history').then((r) => r.data),
  setLevels: (data) => api.post('/users/me/levels', data).then((r) => r.data),
};

export const contentApi = {
  getLevels: () => api.get('/content/levels').then((r) => r.data),
  getSubLevels: (levelId) =>
    api.get('/content/sublevels', { params: levelId ? { levelId } : {} }).then((r) => r.data),
  getTopics: (subLevelId) =>
    api.get('/content/topics', { params: subLevelId ? { subLevelId } : {} }).then((r) => r.data),
};

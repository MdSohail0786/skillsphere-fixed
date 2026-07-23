import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue = [];
const drain = (err, token) => { queue.forEach(p => err ? p.reject(err) : p.resolve(token)); queue = []; };

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      if (refreshing) return new Promise((resolve, reject) => queue.push({ resolve, reject })).then(t => { orig.headers.Authorization = `Bearer ${t}`; return api(orig); });
      orig._retry = true; refreshing = true;
      try {
        const { data } = await api.post('/auth/refresh');
        const t = data.data.accessToken;
        localStorage.setItem('ss_token', t);
        drain(null, t);
        orig.headers.Authorization = `Bearer ${t}`;
        return api(orig);
      } catch (e) {
        drain(e, null);
        localStorage.removeItem('ss_token');
        window.location.href = '/login';
        return Promise.reject(e);
      } finally { refreshing = false; }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  signup: (d) => api.post('/auth/signup', d),
  login: (d) => api.post('/auth/login', d),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (t) => api.post('/auth/verify-email', { token: t }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (d) => api.post('/auth/reset-password', d),
};
export const userAPI = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (d) => api.put('/users/profile', d),
  updateAvatar: (fd) => api.put('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (d) => api.put('/users/change-password', d),
  searchUsers: (p) => api.get('/users/search', { params: p }),
};
export const freelancerAPI = {
  getAll: (p) => api.get('/freelancers', { params: p }),
  getMyProfile: () => api.get('/freelancers/profile/me'),
  getById: (id) => api.get(`/freelancers/${id}`),
  updateProfile: (d) => api.put('/freelancers/profile', d),
  addPortfolio: (fd) => api.post('/freelancers/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePortfolio: (id) => api.delete(`/freelancers/portfolio/${id}`),
  getStats: () => api.get('/freelancers/stats'),
};
export const gigAPI = {
  getAll: (p) => api.get('/gigs', { params: p }),
  getById: (id) => api.get(`/gigs/${id}`),
  getMyGigs: () => api.get('/gigs/my-gigs'),
  create: (fd) => api.post('/gigs', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, d) => api.put(`/gigs/${id}`, d),
  delete: (id) => api.delete(`/gigs/${id}`),
  toggle: (id) => api.patch(`/gigs/${id}/toggle`),
};
export const jobAPI = {
  getAll: (p) => api.get('/jobs', { params: p }),
  getById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  create: (d) => api.post('/jobs', d),
  update: (id, d) => api.put(`/jobs/${id}`, d),
  delete: (id) => api.delete(`/jobs/${id}`),
  getProposals: (id) => api.get(`/jobs/${id}/proposals`),
};
export const proposalAPI = {
  submit: (d) => api.post('/proposals', d),
  getMyProposals: () => api.get('/proposals/my-proposals'),
  getById: (id) => api.get(`/proposals/${id}`),
  accept: (id) => api.patch(`/proposals/${id}/accept`),
  reject: (id, d) => api.patch(`/proposals/${id}/reject`, d),
  withdraw: (id) => api.delete(`/proposals/${id}`),
};
export const projectAPI = {
  getAll: (p) => api.get('/projects', { params: p }),
  getById: (id) => api.get(`/projects/${id}`),
  getStats: () => api.get('/projects/stats'),
  submitMilestone: (pid, mid, d) => api.patch(`/projects/${pid}/milestone/${mid}/submit`, d),
  approveMilestone: (pid, mid) => api.patch(`/projects/${pid}/milestone/${mid}/approve`),
};
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (id, p) => api.get(`/chat/conversations/${id}/messages`, { params: p }),
  createConversation: (d) => api.post('/chat/conversations', d),
  sendMessage: (id, d) => api.post(`/chat/conversations/${id}/messages`, d),
};
export const paymentAPI = {
  createOrder: (d) => api.post('/payments/create-order', d),
  verifyPayment: (d) => api.post('/payments/verify', d),
  getTransactions: (p) => api.get('/payments/transactions', { params: p }),
};
export const reviewAPI = {
  create: (d) => api.post('/reviews', d),
  getByUser: (id, p) => api.get(`/reviews/user/${id}`, { params: p }),
};
export const notificationAPI = {
  getAll: (p) => api.get('/notifications', { params: p }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};
export const aiAPI = {
  matchFreelancers: (jobId) => api.get(`/ai/match-freelancers/${jobId}`),
  getRecommendedJobs: () => api.get('/ai/recommended-jobs'),
  getRecommendedGigs: (p) => api.get('/ai/recommended-gigs', { params: p }),
  getNearby: (p) => api.get('/ai/nearby-freelancers', { params: p }),
};
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (p) => api.get('/admin/users', { params: p }),
  banUser: (id, d) => api.patch(`/admin/users/${id}/ban`, d),
  unbanUser: (id) => api.patch(`/admin/users/${id}/unban`),
  getReports: (p) => api.get('/admin/reports', { params: p }),
  resolveReport: (id, d) => api.patch(`/admin/reports/${id}`, d),
  getTransactions: (p) => api.get('/admin/transactions', { params: p }),
};
export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const usersAPI = {
  getUsers: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
};

export const activitiesAPI = {
  getActivities: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/activities?${queryString}`);
  },
  getActivityById: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  getCategoryInfo: () => api.get('/activities/categories'),
};

export const leaderboardsAPI = {
  getLeaderboards: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/leaderboards?${queryString}`);
  },
  getLeaderboardById: (id) => api.get(`/leaderboards/${id}`),
  getTopPerformers: (type, timeframe, limit = 10) => 
    api.get(`/leaderboards/top/${type}/${timeframe}?limit=${limit}`),
  getCohortLeaderboard: (cohort, type = 'points', limit = 20) => 
    api.get(`/leaderboards/cohort/${cohort}?type=${type}&limit=${limit}`),
  updateLeaderboardRankings: (id) => api.post(`/leaderboards/${id}/update`),
};

export const achievementsAPI = {
  getAchievements: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/achievements?${queryString}`);
  },
  getAchievementById: (id) => api.get(`/achievements/${id}`),
  createAchievement: (data) => api.post('/achievements', data),
};

export const titlesAPI = {
  getTitles: (category) => api.get(`/titles${category ? `?category=${category}` : ''}`),
  getTitleById: (id) => api.get(`/titles/${id}`),
  claimTitle: (id) => api.post(`/titles/${id}/claim`),
  createTitle: (data) => api.post('/titles', data),
};

export default api;
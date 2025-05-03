// frontend/src/api.js

import axios from 'axios';

// 1) Create an Axios instance
const api = axios.create({
  baseURL: '/api',          // all calls go to http://localhost:5173/api → proxied to Django
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2) Add a request interceptor to inject the auth token
api.interceptors.request.use(
  config => {
    // Pull the saved token out of localStorage (or you can swap this to read from a React context)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 3) (Optional) Add a response interceptor to catch 401s centrally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // e.g. redirect to login, or clear auth state
      console.warn('Unauthorized! Redirecting to login …');
      // window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

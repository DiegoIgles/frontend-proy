import axios from 'axios';

const cyborgApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

cyborgApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default cyborgApi;

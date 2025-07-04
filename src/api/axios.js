import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://codenest-blog-backend.onrender.com', // Update this to your server's production URL when deploying
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach token to all requests
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;

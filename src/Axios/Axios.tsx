import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002/api/', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* Optional: response interceptor */
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosInstance;

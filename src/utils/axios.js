import axios from 'axios';
import { backendUrl } from './constants/variables';

const axiosInstance = axios.create({ baseURL: backendUrl, delayed: false });

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.delayed) {
      return new Promise((resolve) => setTimeout(() => resolve(config), 3000));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

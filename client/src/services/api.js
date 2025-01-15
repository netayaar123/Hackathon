import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5012/api', // Use the correct backend prefix
});

export default axiosInstance;
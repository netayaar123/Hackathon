import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Use the correct backend prefix
});

export default axiosInstance;
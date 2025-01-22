import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5012/api', 
});

export default axiosInstance;
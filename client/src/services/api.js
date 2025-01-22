import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5012/api', // Set the base URL for the API requests
});

export default axiosInstance; 
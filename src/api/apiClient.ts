import axios from 'axios';

const BASE_URL = 'https://naman.inextwebs.com/public/api/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export {BASE_URL};
export default apiClient;

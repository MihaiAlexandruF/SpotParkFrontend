import axios from 'axios';
import { getToken } from './authStorage';

const api= axios.create({
    baseURL:'https://https://localhost:7078/api/',
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
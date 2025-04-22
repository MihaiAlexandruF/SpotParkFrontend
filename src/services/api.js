import axios from 'axios';
import { getToken } from './authStorage';
import { Alert } from 'react-native';
import { removeToken } from './authStorage'; 

const api= axios.create({
    baseURL:'https://localhost:7078/api/',
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            removeToken();
            if (error.response?.status === 401) {
                removeToken();
                Alert.alert('Sesiune expirată', 'Te rugăm să te autentifici din nou');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
import axios from 'axios';
import { getToken, removeToken } from './authStorage';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'https://b593-193-226-62-216.ngrok-free.app/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log("Token from SecureStore:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (!error.response) {
      Alert.alert("Network Error", "Please check your internet connection");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await removeToken();
      Alert.alert("Session Expired", "Please login again");
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.Message || 
                        error.response?.data?.message || 
                        "An unexpected error occurred";
    
    if (error.response.status >= 500) {
      Alert.alert("Server Error", "Please try again later");
    } else {
      Alert.alert("Error", errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';
import { getToken, removeToken } from './authStorage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.0.126:5000/api', 
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

    if (error.response.status === 401) {
  await removeToken();
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Token expirat sau acces neautorizat, se face logout...");

      
      await SecureStore.deleteItemAsync("auth_token");

      
      Alert.alert("Sesiune expirată", "Te rugăm să te autentifici din nou.");

      

      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);


export default api;
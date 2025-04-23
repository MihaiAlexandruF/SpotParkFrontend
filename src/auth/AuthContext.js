import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          await api.get('/auth/validate');
          setAuthenticated(true);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('auth_token');
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (responseData) => {  
    const { token, user } = responseData;
    await SecureStore.setItemAsync('auth_token', token);
    setAuthenticated(true);
    setUser(user);  

    console.log('Token saved:', token);
    console.log('User data set:', user);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <AuthContext.Provider value={{ authenticated, user, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
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
          const { data } = await api.get('/auth/validate');
          setAuthenticated(true);
          setUser(data); 
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('auth_token');
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (token, userData = null) => {
    await SecureStore.setItemAsync('auth_token', token);
    setAuthenticated(true);
    if (userData) setUser(userData);
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
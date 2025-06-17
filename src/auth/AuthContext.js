import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import isTokenExpired from '../services/isTokenExpired';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token");

        if (token && !isTokenExpired(token)) {
          const { data } = await api.get("/auth/validate");
          setAuthenticated(true);
          setUser(data); 
        } else {
          await SecureStore.deleteItemAsync("auth_token");
          setAuthenticated(false);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync("auth_token");
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (responseData) => {
    const token = responseData?.token;
    if (!token) {
      console.error("Token lipsă!", responseData);
      throw new Error("Token lipsă!");
    }

    await SecureStore.setItemAsync('auth_token', token);

    try {
      const { data } = await api.get("/auth/validate");
      setAuthenticated(true);
      setUser(data);
    } catch (error) {
      console.error("Eroare la validarea utilizatorului după login:", error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    try {
      const { data } = await api.get("/auth/validate");
      setUser(data);
    } catch (error) {
      console.error("Eroare la reîmprospătarea datelor utilizatorului:", error);
    }
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
    <AuthContext.Provider value={{ authenticated, user, login, handleLogout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

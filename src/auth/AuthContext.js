import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { setAuthHandlers } from './authState';
import api from '../services/api';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

 useEffect(() => {
  
  setAuthHandlers(setAuthenticated, setUser);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");

      if (token) {
        const { data } = await api.get("/auth/validate");
        setAuthenticated(true);
        setUser(data);
      } else {
        throw new Error("Token inexistent");
      }
    } catch (error) {
      await SecureStore.deleteItemAsync("auth_token");
      setAuthenticated(false);
      setUser(null);
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
    await SecureStore.deleteItemAsync('auth_token');
    setAuthenticated(false);
    setUser(null);
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
    <AuthContext.Provider value={{ authenticated, user, login, handleLogout, refreshUserData, setAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}; 

export const useAuth = () => useContext(AuthContext);



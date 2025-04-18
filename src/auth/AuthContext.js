import React, { createContext, use, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getToken,removeToken } from '../services/authStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            setAuthenticated(!!token);
        };
        checkToken();
    }, []);

    const handleLogout = async () => {
        await removeToken();
        setAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{ authenticated, setAuthenticated , handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
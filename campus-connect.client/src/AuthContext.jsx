// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);     // user == null  ➜ still loading
    const [token, setToken] = useState(null);

    // when the component mounts, pull whatever is in localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
    }, []);

    // helper used by your Login page
    const login = (userObj, jwt) => {
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('token', jwt);
        setUser(userObj);
        setToken(jwt);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

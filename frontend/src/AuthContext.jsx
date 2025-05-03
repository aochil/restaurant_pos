import React, { createContext, useState, useEffect } from 'react';
import api from './api'; 


export const AuthContext = createContext({
    token: null,
    role: null,
    login: async() => {},
    register: async() => {},
    logout: () => {},
})

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [role, setRole] = useState(() => localStorage.getItem('role'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token])

    useEffect(() => {
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [role])

    const login = async (username, password) => {
        const {data} = await api.post('/auth/login/', { username, password });
        setToken(data.token);
        setRole(data.role);
    }

    const register = async (username, password, userRole) => {
        await api.post('/auth/register/', { username, password, role: userRole });
        await login(username, password);
    }

    const logout = () => {
        setToken(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ token, role, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
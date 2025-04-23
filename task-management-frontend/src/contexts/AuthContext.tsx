'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to add a token validation endpoint
            setUser({ token } as User);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const user = await api.auth.login(email, password);
            localStorage.setItem('token', user.token);
            setUser(user);
        } catch (error: any) {
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const user = await api.auth.register(username, email, password);
            localStorage.setItem('token', user.token);
            setUser(user);
        } catch (error: any) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
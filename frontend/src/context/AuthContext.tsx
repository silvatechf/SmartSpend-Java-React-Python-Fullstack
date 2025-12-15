// src/context/AuthContext.tsx - VERSÃO FINAL COM INTEGRAÇÃO DE API ROBUSTA

import React, { createContext, useContext, useState, ReactNode } from 'react';

// URL base do seu backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api'; 

// Tipos de dados (inalterados)
interface AuthDetails {
    email: string;
    password: string;
    username?: string; 
}

// 1. Definição da Interface do Contexto (inalterada)
interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (details: Omit<AuthDetails, 'username'>) => Promise<void>;
    signup: (details: AuthDetails) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provedor de Autenticação (inalterado)
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('jwtToken')
    );

    const isAuthenticated = !!token;

    const setAuthToken = (jwtToken: string) => {
        localStorage.setItem('jwtToken', jwtToken);
        setToken(jwtToken);
    };

    // --- FUNÇÃO DE LOGIN REAL (CHAMADA API) ---
    const login = async ({ email, password }: Omit<AuthDetails, 'username'>) => {
        // CORREÇÃO DE ROTA GARANTIDA: /api/auth/login
        const response = await fetch(`${API_BASE_URL}/auth/login`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        // ... (restante da lógica de tratamento de erro inalterada)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed. Check your credentials.');
        }

        const data = await response.json();
        const jwtToken = data.token || data.jwt; 
        if (!jwtToken) {
             throw new Error("Login successful, but no JWT token received from server.");
        }
        
        setAuthToken(jwtToken);
    };

    // --- FUNÇÃO DE CADASTRO REAL (CHAMADA API) ---
    const signup = async ({ email, password, username }: AuthDetails) => {
        // CORREÇÃO DE ROTA GARANTIDA: /api/auth/register
        const response = await fetch(`${API_BASE_URL}/auth/register`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, username }),
        });
        // ... (restante da lógica de tratamento de erro inalterada)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed. Try a different email.');
        }

        const data = await response.json();
        const jwtToken = data.token || data.jwt; 
        
        if (jwtToken) {
            setAuthToken(jwtToken);
        } else {
            await login({ email, password }); 
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook para Consumir o Contexto (inalterado)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
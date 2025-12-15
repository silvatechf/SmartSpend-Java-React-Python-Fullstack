// src/pages/AuthPage.tsx - Tela de Login e Cadastro (LÓGICA SINC.)

import React, { useState, useCallback } from 'react';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
    const { login, signup } = useAuth(); // Importamos as funções
    const navigate = useNavigate();
    
    // Estado para alternar entre Login e Cadastro
    const [isLogin, setIsLogin] = useState(true);
    
    // Estados do Formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);

    
    const handleAuth = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password || (!isLogin && !username)) {
            alert("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Simulação de Login
                await login({ email, password }); 
                
            } else {
                // Simulação de Cadastro
                await signup({ email, password, username }); 
            }
            
            // Redireciona para o dashboard após sucesso
            navigate('/', { replace: true });

        } catch (error) {
            console.error("Auth failed:", error);
            alert(`Authentication failed. Please check credentials. (See console for details)`);
        } finally {
            setIsLoading(false);
        }

    }, [isLogin, email, password, username, login, signup, navigate]);


    const title = isLogin ? "Welcome Back to SmartSpend" : "Create Your SmartSpend Account";
    const buttonText = isLogin ? "Log In" : "Sign Up";
    const Icon = isLogin ? LogIn : UserPlus;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl shadow-black/50 text-gray-100 border border-gray-700">
                <h1 className="text-3xl font-bold text-center text-indigo-400">{title}</h1>
                <p className="text-sm text-center text-gray-400">
                    {isLogin 
                        ? "Enter your credentials to access your dashboard."
                        : "Join SmartSpend to manage your finances smarter."
                    }
                </p>

                <form onSubmit={handleAuth} className="space-y-4">
                    
                    {/* Campo Username (Apenas para Cadastro) */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Username (e.g., Fernando_SS)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
                            required
                        />
                    )}

                    {/* Campo Email */}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
                        required
                    />

                    {/* Campo Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400 transition"
                        required
                    />

                    {/* Botão de Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-800 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Icon className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? "Processing..." : buttonText}
                    </button>
                </form>

                {/* Alternar entre Login e Cadastro */}
                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                        disabled={isLoading}
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : "Already have an account? Log In"
                        }
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
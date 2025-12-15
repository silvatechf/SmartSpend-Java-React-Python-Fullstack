
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import './index.css';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rota Protegida (Exige Login) */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Rota de Autenticação (Login/Cadastro) */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Fallback para qualquer outra rota */}
                <Route path="*" element={<AuthPage />} /> 
            </Routes>
        </Router>
    );
};

export default App;
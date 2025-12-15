// src/pages/DashboardPage.tsx - VERSÃO FINAL COM ALERTA DE IA INTEGRADO
import React, { useState, useCallback } from 'react';
import { useFinance } from '../hooks/useFinance';
import { 
    Utensils, CheckCircle, DollarSign, Target, Download, LineChart, LogOut, Upload, Settings, 
    TrendingUp, TrendingDown, Shield, Bus, Gamepad2, Home, HeartPulse, Ellipsis, 
    GraduationCap, Plane, Trash2, Loader2, Moon, Sun, Brain
} from 'lucide-react';
import { BarChart as RechartsBar, Bar, PieChart as RechartsPie, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { CategoryKey, Transaction, Category, AnalysisResult } from '../data/financeTypes';
import { useAuth } from '../context/AuthContext'; 

// --- Sub-Componentes UI ---

interface CardProps { children: React.ReactNode; className?: string; isDarkMode: boolean; }
const GlassCard: React.FC<CardProps> = ({ children, className = '', isDarkMode }) => (
    <div className={`
        ${isDarkMode 
            ? 'bg-gray-800/80 border-gray-700/50 shadow-2xl shadow-black/50 text-gray-100' // Dark Mode
            : 'bg-white/90 border-gray-200/50 shadow-lg text-gray-900'} // Light Mode
        backdrop-blur-sm rounded-xl p-6 
        hover:shadow-xl transition-shadow duration-300 ${className}
    `}>
        {children}
    </div>
);

const LucideIconMap: Record<string, React.ElementType> = { 
    Shield: Shield, Utensils: Utensils, Bus: Bus, Gamepad2: Gamepad2, Home: Home, 
    HeartPulse: HeartPulse, Ellipsis: Ellipsis, GraduationCap: GraduationCap, Target: Target,
    Plane: Plane, Settings: Settings,
};

const TrendIndicator: React.FC<{ trendPercentage: number }> = ({ trendPercentage }) => {
    if (typeof trendPercentage !== 'number' || trendPercentage === 0) return null; 
    
    const isUp = trendPercentage > 0;
    const Icon = isUp ? TrendingUp : TrendingDown;
    const color = isUp ? 'text-red-500' : 'text-green-500';
    
    return (
        <span className={`flex items-center text-sm font-semibold ${color} mt-1`}>
            <Icon className="w-4 h-4 mr-1"/>
            {Math.abs(trendPercentage).toFixed(0)}% vs Last Month
        </span>
    );
};


interface IconCardProps { 
    title: string; 
    value: string; // Valor formatado com moeda (ex: "€ 2728.00")
    trend?: number; 
    icon: React.ReactNode; 
    color: string; 
    alert?: string | null; 
    showTrend?: boolean;
    isDarkMode: boolean; 
    
    // --- NOVAS PROPRIEDADES PARA O ALERTA DE IA ---
    isForecast?: boolean;
    budgetValue?: number; // O limite do orçamento
}

const IconCard: React.FC<IconCardProps> = ({ 
    title, 
    value, 
    trend, 
    icon, 
    color, 
    alert, 
    showTrend = false, 
    isDarkMode, 
    isForecast = false,
    budgetValue = 0,
}) => {
    
    // 1. CÁLCULOS DE ALERTA DE IA
    // Extrai o valor numérico do string (ex: "€ 2728.00" -> 2728.00)
    const forecastValue = isForecast ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : 0;
    
    const isOverBudget = isForecast && forecastValue > budgetValue && budgetValue > 0;
    const overspendAmount = isOverBudget ? (forecastValue - budgetValue).toFixed(2) : null;
    const currency = value.split(' ')[0]; // Pega o símbolo da moeda (ex: "€")

    // 2. ESTILOS TAILWIND CONDICIONAIS
    let cardAlertStyles = '';
    let alertTextStyle = isDarkMode ? 'text-red-400' : 'text-red-700';

    if (isOverBudget) {
        // Estilo de Alerta Agressivo para Estouro de Orçamento (Tailwind)
        cardAlertStyles = 'bg-red-900/40 border-2 border-red-500 ring-4 ring-red-500/30';
    }
    
    let alertBadgeStyle = '';
    if (alert?.startsWith('CRITICAL')) { 
        alertBadgeStyle = 'bg-red-100 text-red-700';
    } else if (alert?.startsWith('WARNING')) { 
        alertBadgeStyle = 'bg-yellow-100 text-yellow-700';
    } else if (alert?.startsWith('HEALTHY')) { 
        alertBadgeStyle = 'bg-green-100 text-green-700';
    } else if (alert) {
         alertBadgeStyle = 'bg-gray-100 text-gray-700';
    }
    
    return (
        <GlassCard 
            className={`flex flex-col justify-between h-full transition duration-300 ${cardAlertStyles}`} 
            isDarkMode={isDarkMode}
        >
            
            {/* 3. SELO DE ALERTA DE IA (Visível apenas se estiver em alerta) */}
            {isOverBudget && (
                <div className={`absolute top-0 right-0 p-1.5 rounded-bl-xl rounded-tr-xl text-xs font-bold text-white shadow-lg flex items-center ${isDarkMode ? 'bg-purple-600' : 'bg-purple-700'}`}>
                    <Brain className="w-4 h-4 mr-1"/> AI Insight
                </div>
            )}

            <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
                <div className={`p-2 rounded-full`} style={{backgroundColor: color}}> 
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 text-white' })}
                </div>
            </div>
            
            <div className="mt-4">
                <p className={`text-3xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{value}</p>
                
                {/* 4. EXIBIÇÃO DO OVERSPEND (Só aparece se houver estouro de orçamento) */}
                {isOverBudget && (
                    <div className="mt-3 pt-2 border-t border-red-500/50">
                        <p className={`text-sm font-medium ${alertTextStyle}`}>
                            Projected Overspend: 
                        </p>
                        <p className={`text-2xl font-extrabold ${alertTextStyle}`}>
                            {currency} {overspendAmount}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Budget Target: {currency} {budgetValue.toFixed(2)}
                        </p>
                    </div>
                )}
                
                <div className="flex items-start justify-between flex-wrap mt-1"> 
                    {showTrend && trend !== undefined && (
                        <TrendIndicator trendPercentage={trend} />
                    )}
                    
                    {/* Alerta original é mantido, mas não aparecerá no Forecast se isOverBudget for true */}
                    {alert && !isOverBudget && ( 
                        <div className={`text-xs p-1 rounded-md max-w-full md:max-w-[60%] text-right mt-1 md:mt-0 ${alertBadgeStyle}`}>
                            {alert.split(':')[0]}
                        </div>
                    )}
                </div>
                {alert && !alert.startsWith('CRITICAL') && !alert.startsWith('WARNING') && !alert.startsWith('HEALTHY') && !isOverBudget && (
                     <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{alert}</p>
                )}
            </div>
        </GlassCard>
    );
};


const GoalCard: React.FC<{ goal: any, currency: string, isDarkMode: boolean }> = ({ goal, currency, isDarkMode }) => {
    const progress = Math.round(goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0);
    const Icon = LucideIconMap[goal.icon] || Target;
    return (
        <GlassCard className="flex flex-col space-y-2" isDarkMode={isDarkMode}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{goal.name}</h3>
                <Icon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                    className="h-2 bg-purple-600 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                {progress}% Saved ({currency} {goal.savedAmount.toFixed(2)} / {currency} {goal.targetAmount.toFixed(2)})
            </p>
        </GlassCard>
    );
};


// --- Dashboard Principal ---

const DashboardPage: React.FC = () => {
    const { logout } = useAuth(); 
    const { data, analysis, addTransaction, CATEGORIES, updatePreferences, resetFinancialData } = useFinance(); 
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false); 
    const [isDarkMode, setIsDarkMode] = useState(true); // INICIA NO DARK MODE

    const { 
        totalSpent, 
        remaining, 
        budgetLimit, 
        alertMessage, 
        forecast, 
        trendPercentage, 
        forecastInsight,
        monthlyTotals 
    } = analysis;

    const currency = data.preferences.currency; 
    
    
    const safeMonthlyTotals: AnalysisResult['monthlyTotals'] = monthlyTotals ?? {}; 

    const formattedMonthlyTotals = Object.entries(safeMonthlyTotals).map(([monthYear, data]) => ({
        monthYear,
        ...data.categories,
    }));
    
    
    const categoryKeysInData = new Set(
        formattedMonthlyTotals.flatMap(m => Object.keys(m))
    );
    
    const pieData = Object.entries(safeMonthlyTotals).reduce((acc, [monthYear, data]) => {
        Object.entries(data.categories).forEach(([categoryKey, amount]) => {
            const categoryConfig = CATEGORIES[categoryKey as CategoryKey]; 
            const existing = acc.find(item => item.name === categoryConfig.name);
            
            if (existing) {
                existing.value += amount as number;
            } else {
                acc.push({ 
                    name: categoryConfig.name, 
                    value: amount as number, 
                    color: categoryConfig.color
                });
            }
        });
        return acc;
    }, [] as { name: string, value: number, color: string }[]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };
    
    const handleMockScanAndSave = useCallback(() => {
        if (!selectedFile) {
            alert("Please select a file (PDF/Image) to simulate the scan.");
            return;
        }

        setIsAnalyzing(true); 

        
        setTimeout(() => {
            const newTransaction: Omit<Transaction, 'id'> = {
                date: new Date().toISOString().substring(0, 10),
                description: `AI Scanned Receipt - ${selectedFile.name.substring(0, 15)}`, 
                amount: 75 + Math.random() * 25, 
                category: 'FOOD', 
                source: 'Local Restaurant',
                paymentMethod: 'Debit Card',
            };
            addTransaction(newTransaction);
            setSelectedFile(null); 
            setIsAnalyzing(false); 
            alert(`Transaction of ${currency} ${newTransaction.amount.toFixed(2)} (${newTransaction.category}) added. (Simulated AI Scan)`);
        }, 3000); 
    }, [selectedFile, addTransaction, currency]);
    
    // ✅ CORREÇÃO: Funções de atualização do Budget
    const handleBudgetUpdate = () => {
        const value = prompt(`Enter new budget limit (current: ${currency}${budgetLimit.toFixed(2)}):`);
        
        // Verifica se o usuário não cancelou e se o valor é um número válido.
        if (value !== null && !isNaN(Number(value)) && value.trim() !== '') {
            updatePreferences({ budgetLimit: Number(value) });
        } else if (value !== null) {
              alert("Please enter a valid number for the budget limit.");
        }
    };


    return (
        <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-500 
            ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        >
            
            {/* --- HEADER (Theme Toggle e Logout) --- */}
            <header className={`flex justify-between items-center mb-6 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>SmartSpend Dashboard</h1>
                <div className="flex space-x-4">
                    {/* Botão de Toggle do Tema */}
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-3 rounded-full shadow-md transition duration-150 
                            ${isDarkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                    </button>

                    <button 
                        onClick={logout}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-150"
                    >
                        <LogOut className="w-5 h-5 mr-2"/> Logout
                    </button>
                </div>
            </header>
            
            {/* Section 1: Key Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                
                {/* 1. Total Spent */}
                <IconCard 
                    title="Total Spent (Monthly)" 
                    value={`${currency} ${totalSpent.toFixed(2)}`} 
                    icon={<DollarSign />}
                    color={'#3B82F6'} 
                    alert={alertMessage}
                    trend={trendPercentage}
                    showTrend={true}
                    isDarkMode={isDarkMode}
                />
                
                {/* 2. Remaining Balance */}
                <IconCard 
                    title="Remaining Balance" 
                    value={`${currency} ${remaining.toFixed(2)}`} 
                    icon={<CheckCircle />}
                    color={remaining < 0 ? '#EF4444' : '#10B981'} 
                    alert={remaining <= 0 ? 'CRITICAL: Exceeded' : undefined}
                    isDarkMode={isDarkMode}
                />
                
                {/* 3. SPENDING FORECAST (AGORA COM LÓGICA DE ALERTA DE IA) */}
                 <IconCard 
                    title="Spending Forecast" 
                    value={`${currency} ${forecast.toFixed(2)}`} 
                    icon={<LineChart />}
                    color="#8B5CF6" 
                    // Propriedades para o Alerta de IA:
                    isForecast={true} // Marca este card
                    budgetValue={budgetLimit} // Valor do Orçamento
                    isDarkMode={isDarkMode}
                />
                
                {/* 4. Monthly Budget */}
                 <IconCard 
                    title="Monthly Budget" 
                    value={`${currency} ${budgetLimit.toFixed(2)}`} 
                    icon={<Target />}
                    color="#6366F1"
                    isDarkMode={isDarkMode}
                />
            </div>
            
            {/* Section 2: Data Visualizations (Graphs) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Graph 1: Monthly Trends (Bar Chart) */}
                <GlassCard className="lg:col-span-2 h-[400px]" isDarkMode={isDarkMode}>
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Monthly Trends by Category</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <RechartsBar 
                            data={formattedMonthlyTotals} 
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e0e0e0'} />
                            <XAxis dataKey="monthYear" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                            <YAxis tickFormatter={(value) => `${currency} ${value}`} stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', border: isDarkMode ? '1px solid #4b5563' : '1px solid #ccc' }}
                                itemStyle={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}
                                formatter={(value: any) => [`${currency} ${Number(value).toFixed(2)}`, 'Total']} 
                            />
                            <Legend />
                            {Object.values(CATEGORIES)
                                .filter(cat => categoryKeysInData.has(cat.key))
                                .map((cat: Category, index: number) => ( 
                                <Bar 
                                    key={cat.key} 
                                    dataKey={cat.key} 
                                    stackId="a" 
                                    fill={cat.color} 
                                    name={cat.name} 
                                />
                            ))}
                        </RechartsBar>
                    </ResponsiveContainer>
                </GlassCard>

                {/* Graph 2: Spending Distribution (Pie Chart) */}
                <GlassCard className="h-[400px]" isDarkMode={isDarkMode}>
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Spending Distribution</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <RechartsPie>
                            <Pie 
                                data={pieData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" cy="50%" 
                                outerRadius={120} 
                                fill="#8884d8" 
                                labelLine={false}
                                label={({ name, percent }) => {
                                    const p = percent as number | undefined; 
                                    return `${name}: ${p !== undefined ? (p * 100).toFixed(0) : '0'}%`;
                                }}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} /> 
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', border: isDarkMode ? '1px solid #4b5563' : '1px solid #ccc' }}
                                itemStyle={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}
                                formatter={(value: any) => `${currency} ${Number(value).toFixed(2)}`} 
                            />
                            <Legend />
                        </RechartsPie>
                    </ResponsiveContainer>
                </GlassCard>
            </div>
            
            {/* Section 3: Goals, History, and Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Savings Goals (33%) */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Savings Goals</h2>
                    {data.goals.map((goal: any) => ( 
                        <GoalCard key={goal.id} goal={goal} currency={currency} isDarkMode={isDarkMode} />
                    ))}
                </div>

                {/* History and Actions (66%) */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard isDarkMode={isDarkMode}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Scan & Export Controls</h2>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            
                            {/* 1. Botão de Upload MAIOR E DESTAQUE */}
                            <div className="flex flex-col flex-grow">
                                <label className={`flex items-center justify-center p-4 rounded-lg shadow-md transition duration-150 text-lg font-semibold 
                                    ${isDarkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-300 text-gray-800'}
                                    ${!isAnalyzing ? (isDarkMode ? 'hover:bg-gray-500 cursor-pointer' : 'hover:bg-gray-400 cursor-pointer') : 'cursor-not-allowed opacity-70'}`}
                                >
                                    <Upload className="w-6 h-6 mr-3"/> 
                                    {selectedFile ? selectedFile.name.substring(0, 20) + '...' : "Browse & Upload File"}
                                    <input 
                                        type="file" 
                                        accept="application/pdf,image/*" 
                                        onChange={handleFileChange} 
                                        className="hidden"
                                        disabled={isAnalyzing} 
                                    />
                                </label>
                                {/* FORMATOS ACEITOS */}
                                <p className={`text-xs mt-1 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Accepted formats: PDF, JPG, PNG, GIF
                                </p>
                            </div>
                            
                            {/* 2. Botão de Análise MAIOR com LOADING SPINNER */}
                            <button 
                                onClick={handleMockScanAndSave}
                                disabled={!selectedFile || isAnalyzing} 
                                className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition duration-150 text-lg font-semibold w-full sm:w-auto"
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                ) : (
                                    <Utensils className="w-6 h-6 mr-2" />
                                )}
                                {isAnalyzing ? 'Analyzing Receipt...' : 'Analyze & Save'}
                            </button>

                            {/* 3. Controles Secundários */}
                            <div className="flex space-x-2 ml-auto w-full sm:w-auto sm:mt-0">
                                <button 
                                    onClick={() => alert('Exporting data to CSV, PDF, or Excel...')} 
                                    className="p-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-150 flex-grow sm:flex-grow-0"
                                    title="Export Report (CSV, PDF, Excel)" 
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                
                                <button 
                                    onClick={handleBudgetUpdate}
                                    className="p-3 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600 transition duration-150 flex-shrink-0"
                                    title="Adjust Monthly Budget"
                                >
                                    <Settings className="w-5 h-5" /> 
                                </button>
                                
                                {/* BOTÃO DE ZERAR DADOS */}
                                <button 
                                    onClick={resetFinancialData}
                                    className="p-3 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-150 flex-shrink-0"
                                    title="Reset ALL Financial Data (Irreversible)"
                                >
                                    <Trash2 className="w-5 h-5" /> 
                                </button>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Timeline / Full Transaction History */}
                    <GlassCard isDarkMode={isDarkMode}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Full Transaction History</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {data.transactions.sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t: Transaction) => (
                                <div key={t.id} className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-md`} style={{backgroundColor: CATEGORIES[t.category].color}}>
                                            {React.createElement(LucideIconMap[CATEGORIES[t.category].icon] || Utensils, { className: "w-4 h-4 text-white" })}
                                        </div>
                                        <div>
                                            <p className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{t.description}</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{CATEGORIES[t.category].name} @ {t.source} ({t.date})</p>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-bold ${t.amount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {currency} {t.amount.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;
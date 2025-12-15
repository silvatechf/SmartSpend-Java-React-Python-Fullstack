// src/hooks/useFinance.ts - VERSÃO FINAL E ROBUSTA

import { useState, useEffect, useMemo, useCallback } from 'react';
// Importação dos Tipos Corrigidos e Sincronizados
import { initialData, Transaction, CategoryKey, CATEGORIES, FinanceData, AnalysisResult } from '../data/financeTypes'; 
import { v4 as uuidv4 } from 'uuid'; 


const STORAGE_KEY = 'smartspend_finance_data';
const BUDGET_WARNING_THRESHOLD = 0.8; 
const BUDGET_HEALTHY_THRESHOLD = 0.7; 

// --- FUNÇÕES AUXILIARES DE DATA E CÁLCULO ---

const getPreviousMonthKey = (currentMonthKey: string) => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    let prevYear = year;
    let prevMonth = month - 1;
    
    if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
    }
    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}

const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

const calculateMonthlyTotals = (transactions: Transaction[]) => {
    type MonthlySummary = { total: number, categories: Record<CategoryKey, number> };
    
    return transactions.reduce((acc, t) => {
        const monthKey = t.date.substring(0, 7); 
        
        if (!acc[monthKey]) {
            // Inicialização robusta do mês
            const initialCategories = {} as Record<CategoryKey, number>;
            acc[monthKey] = { total: 0, categories: initialCategories }; 
        }

        acc[monthKey].total += t.amount;
        
        // Garante que a categoria seja inicializada em 0 antes de somar
        const categoryKey = t.category;
        acc[monthKey].categories[categoryKey] = (acc[monthKey].categories[categoryKey] || 0) + t.amount;
        
        return acc;
    }, {} as Record<string, MonthlySummary>);
};

// --- DADOS DE DEMONSTRAÇÃO RICOS (Com theme adicionado) ---

const createTransaction = (monthOffset: number, description: string, amount: number, category: CategoryKey, source: string): Transaction => {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth() - monthOffset, 15);
    return {
        id: uuidv4(),
        date: date.toISOString().substring(0, 10),
        description,
        amount,
        category,
        source,
        paymentMethod: 'Credit Card',
    };
};

const DEMO_TRANSACTIONS: Transaction[] = [
    // MÊS 0 (Atual)
    createTransaction(0, 'Grocery Shopping', 450.00, 'FOOD', 'Local Mart'),
    createTransaction(0, 'Subscription Service', 120.00, 'ENTERTAINMENT', 'Global Streaming'),
    createTransaction(0, 'Car Fuel Refill', 220.00, 'TRANSPORT', 'Shell'),
    createTransaction(0, 'Dinner Out', 180.00, 'FOOD', 'Italian Bistro'),
    createTransaction(0, 'New Phone Upgrade', 350.00, 'MISC', 'Apple Store'), 

    // MÊS 1 (Passado)
    createTransaction(1, 'Monthly Rent Share', 800.00, 'HOME', 'Landlord'),
    createTransaction(1, 'Online Course Fee', 250.00, 'EDUCATION', 'Coursera'), 
    createTransaction(1, 'Gas Bill', 150.00, 'HOME', 'Utility Co.'),
    createTransaction(1, 'Weekend Trip', 500.00, 'TRAVEL', 'Booking.com'), 
    createTransaction(1, 'Gym Membership', 70.00, 'HEALTH', 'Fitness Club'), 

    // MÊS 2 (Antigo)
    createTransaction(2, 'Movie Tickets', 50.00, 'ENTERTAINMENT', 'Cineplex'),
    createTransaction(2, 'Public Transport Pass', 90.00, 'TRANSPORT', 'City Metro'),
    createTransaction(2, 'Therapy Session', 150.00, 'HEALTH', 'Clinic'),
    createTransaction(2, 'Books & Supplies', 80.00, 'EDUCATION', 'Book Store'),
    createTransaction(2, 'Taxes/Fees', 130.00, 'MISC', 'Government'),
];

const INITIAL_DATA_WITH_DEMO: FinanceData = {
    preferences: {
        currency: '€', 
        budgetLimit: 1500, 
        theme: 'minimalist', // CRÍTICO: theme adicionado para estabilidade do estado
    },
    goals: [
        { id: 'g1', name: 'Emergency Fund', targetAmount: 5000, savedAmount: 1200, icon: 'Shield', dueDate: '2026-12-31' },
        { id: 'g2', name: 'Vacation Fund', targetAmount: 2000, savedAmount: 550, icon: 'Plane', dueDate: '2025-10-01' },
    ],
    transactions: DEMO_TRANSACTIONS,
};

// --- FUNÇÃO DE ANÁLISE (INALETRADA, JÁ ESTÁ CORRETA) ---

const calculateAnalysis = (data: FinanceData): AnalysisResult => {
    const todayDate = new Date();
    const currentMonthKey = todayDate.toISOString().substring(0, 7);
    const monthlyTotals = calculateMonthlyTotals(data.transactions);
    const currentMonthData = monthlyTotals[currentMonthKey] || { total: 0, categories: {} };
    
    const totalSpent = currentMonthData.total;
    const budgetLimit = data.preferences.budgetLimit;
    const remaining = budgetLimit - totalSpent;
    const spendingRatio = budgetLimit > 0 ? totalSpent / budgetLimit : 0;

    // 1. TRENDING INDICATOR
    const prevMonthKey = getPreviousMonthKey(currentMonthKey);
    const lastMonthTotal = monthlyTotals[prevMonthKey]?.total || 0;
    
    let trendPercentage = 0;
    if (lastMonthTotal > 0) {
        trendPercentage = ((totalSpent - lastMonthTotal) / lastMonthTotal) * 100;
    } else if (totalSpent > 0) {
         trendPercentage = 100; 
    }

    // 2. CONTEXTUAL ALERT SYSTEM
    let alertMessage: string | null = null;
    if (totalSpent > budgetLimit) {
        alertMessage = `CRITICAL: Budget exceeded by ${data.preferences.currency} ${Math.abs(remaining).toFixed(2)}`;
    } else if (spendingRatio >= BUDGET_WARNING_THRESHOLD) {
        alertMessage = 'WARNING: Nearing budget limit (80%+)';
    } else if (spendingRatio <= BUDGET_HEALTHY_THRESHOLD) {
        alertMessage = 'HEALTHY: Spending under control (< 70%)';
    }

    // 3. FORECAST DETAIL & DAILY LIMIT
    const daysInMonth = getDaysInMonth(todayDate);
    const currentDayOfMonth = todayDate.getDate();
    const daysRemainingInMonth = daysInMonth - currentDayOfMonth;
    
    let forecastInsight: string = '';
    const averageDailySpend = totalSpent / (currentDayOfMonth || 1);
    const forecast = averageDailySpend * daysInMonth;

    if (daysRemainingInMonth > 0 && remaining > 0) {
        const recommendedDailyLimit = remaining / daysRemainingInMonth;
        forecastInsight = `Recommended daily limit: ${data.preferences.currency} ${recommendedDailyLimit.toFixed(2)}`;
    } else if (remaining <= 0) {
        forecastInsight = `Budget exceeded. Avg daily spend: ${data.preferences.currency} ${averageDailySpend.toFixed(2)}`;
    } else {
         forecastInsight = `Avg daily budget: ${data.preferences.currency} ${(budgetLimit / daysInMonth).toFixed(2)}`;
    }

    return {
        totalSpent,
        remaining,
        budgetLimit,
        alertMessage,
        monthlyTotals,
        forecast,
        trendPercentage,
        forecastInsight, 
    } as AnalysisResult; 
};

// --- HOOK PRINCIPAL useFinance (Retorno tipado para resolver o erro "void") ---
export const useFinance = (): {
    data: FinanceData;
    analysis: AnalysisResult;
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    updatePreferences: (p: Partial<FinanceData['preferences']>) => void;
    CATEGORIES: typeof CATEGORIES;
    resetFinancialData: () => void;
} => {
    const [data, setData] = useState<FinanceData>(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                // Lógica de proteção: garante que o theme (e outros campos) existam
                const parsedData = JSON.parse(savedData);
                const preferences = {
                    ...INITIAL_DATA_WITH_DEMO.preferences,
                    ...parsedData.preferences
                };

                return { ...INITIAL_DATA_WITH_DEMO, ...parsedData, preferences };
            } catch (e) {
                console.error("Erro ao analisar dados armazenados, usando dados de demonstração.", e);
            }
        }
        return INITIAL_DATA_WITH_DEMO;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const addTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
        setData(prev => ({
            ...prev,
            transactions: [...prev.transactions, { id: uuidv4(), ...newTransaction }],
        }));
    }, []);

    const updatePreferences = useCallback((newPrefs: Partial<FinanceData['preferences']>) => {
        setData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, ...newPrefs },
        }));
    }, []);

    const resetFinancialData = useCallback(() => {
        if (window.confirm("ATENÇÃO: Você tem certeza que deseja zerar TUDO (transações e metas)?")) {
            // Mantém o tema atual (dark/light) no reset, se o usuário o mudou
            const resetData: FinanceData = {
                ...INITIAL_DATA_WITH_DEMO,
                preferences: {
                    ...INITIAL_DATA_WITH_DEMO.preferences,
                    theme: data.preferences.theme 
                }
            };
            setData(resetData); 
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
            alert("Dados resetados para a demonstração. O Dashboard será atualizado.");
            window.location.reload(); 
        }
    }, [data.preferences.theme]);

    const analysis = useMemo(() => calculateAnalysis(data), [data]);

    return {
        data,
        analysis,
        addTransaction,
        updatePreferences,
        CATEGORIES,
        resetFinancialData, 
    };
};


export type CategoryKey = 'FOOD' | 'TRANSPORT' | 'HEALTH' | 'ENTERTAINMENT' | 'EDUCATION' | 'MISC' | 'HOME' | 'TRAVEL';

export interface Category {
    key: CategoryKey;
    name: string;
    color: string;
    icon: string; 
}

export interface Transaction {
    id: string;
    date: string; 
    description: string;
    amount: number;
    category: CategoryKey;
    source: string;
    paymentMethod: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    savedAmount: number;
    icon: string;
    dueDate: string;
}


export interface DashboardPreferences {
    theme: 'minimalist' | 'glassmorphism';
    currency: string;
    budgetLimit: number;
}



export interface FinanceData { 
    transactions: Transaction[];
    goals: Goal[];
    preferences: DashboardPreferences;
}


export interface AnalysisResult {
    totalSpent: number;
    remaining: number;
    budgetLimit: number;
    monthlyTotals: Record<string, { total: number; categories: Record<CategoryKey, number> }>;
    trendPercentage: number;
    alertMessage: string | null;
    forecast: number;
    forecastInsight: string;
}


export const CATEGORIES: Record<CategoryKey, Category> = {
    FOOD: { key: 'FOOD', name: 'Food & Dining', icon: 'Utensils', color: '#EF4444' }, 
    TRANSPORT: { key: 'TRANSPORT', name: 'Transportation', icon: 'Bus', color: '#3B82F6' }, 
    ENTERTAINMENT: { key: 'ENTERTAINMENT', name: 'Entertainment', icon: 'Gamepad2', color: '#8B5CF6' }, 
    
    HOME: { key: 'HOME', name: 'Housing & Utilities', icon: 'Home', color: '#16A34A' }, 
    
    HEALTH: { key: 'HEALTH', name: 'Health & Wellness', icon: 'HeartPulse', color: '#10B981' }, 
    EDUCATION: { key: 'EDUCATION', name: 'Education', icon: 'GraduationCap', color: '#F59E0B' }, 
    
    TRAVEL: { key: 'TRAVEL', name: 'Travel', color: '#7C3AED', icon: 'Plane' },
    MISC: { key: 'MISC', name: 'Miscellaneous', icon: 'Ellipsis', color: '#6B7280' }, 
};


const today = new Date().toISOString().substring(0, 10);
const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 10);

export const initialData: FinanceData = {
    transactions: [
        { id: 't1', date: today, description: 'SmartSpend Setup', amount: 6755.00, category: 'MISC', source: 'Setup Fee', paymentMethod: 'Transfer' }, 
        { id: 't2', date: lastMonth, description: 'Monthly Rent', amount: 1500.00, category: 'HOME', source: 'Bank Transfer', paymentMethod: 'Transfer' }, 
        { id: 't3', date: lastMonth, description: 'Cinema Tickets', amount: 50.00, category: 'ENTERTAINMENT', source: 'Cineplex', paymentMethod: 'Credit Card' },
        { id: 't4', date: today, description: 'Weekly Groceries', amount: 350.00, category: 'FOOD', source: 'Local Market', paymentMethod: 'Debit Card' },
        { id: 't5', date: today, description: 'Train Pass', amount: 120.00, category: 'TRANSPORT', source: 'Metro Station', paymentMethod: 'Credit Card' },
    ],
    goals: [
        { id: 'g1', name: 'Emergency Fund', targetAmount: 5000, savedAmount: 1250, icon: 'Shield', dueDate: '2026-12-31' },
        { id: 'g2', name: 'Vacation Fund', targetAmount: 2000, savedAmount: 400, icon: 'Plane', dueDate: '2025-10-01' },
    ],
    preferences: {
        theme: 'minimalist', 
        currency: '€', 
        budgetLimit: 3000,
    }
};
import React, { createContext, useContext } from 'react';
import { Transaction, PaymentMethod } from './CartContext';
import { useAuth } from './AuthContext';

interface SalesByPaymentMethod {
  method: PaymentMethod;
  count: number;
  total: number;
}

interface DailySales {
  date: string;
  total: number;
  transactionCount: number;
}

interface ProductSale {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

interface CashierPerformance {
  cashierId: string;
  cashierName: string;
  transactionCount: number;
  totalSales: number;
}

export interface Report {
  startDate: Date;
  endDate: Date;
  totalSales: number;
  transactionCount: number;
  averageTransactionValue: number;
  salesByPaymentMethod: SalesByPaymentMethod[];
  dailySales: DailySales[];
  topProducts: ProductSale[];
  cashierPerformance: CashierPerformance[];
}

interface ReportContextType {
  generateReport: (transactions: Transaction[], startDate: Date, endDate: Date) => Report;
  canAccessReports: boolean;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Check if user has permission to access reports
  const canAccessReports = user?.role === 'admin' || user?.role === 'manager';
  
  const generateReport = (transactions: Transaction[], startDate: Date, endDate: Date): Report => {
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // Calculate total sales and transaction count
    const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const transactionCount = filteredTransactions.length;
    const averageTransactionValue = transactionCount > 0 
      ? totalSales / transactionCount 
      : 0;
    
    // Calculate sales by payment method
    const paymentMethods: Record<PaymentMethod, { count: number, total: number }> = {
      'cash': { count: 0, total: 0 },
      'card': { count: 0, total: 0 },
      'mobile': { count: 0, total: 0 },
      'petty-cash': { count: 0, total: 0 }
    };
    
    filteredTransactions.forEach(t => {
      paymentMethods[t.paymentMethod].count++;
      paymentMethods[t.paymentMethod].total += t.total;
    });
    
    const salesByPaymentMethod = Object.entries(paymentMethods).map(([method, data]) => ({
      method: method as PaymentMethod,
      count: data.count,
      total: data.total
    }));
    
    // Calculate daily sales
    const dailySalesMap = new Map<string, { total: number; count: number }>();
    
    filteredTransactions.forEach(t => {
      const date = new Date(t.timestamp).toISOString().split('T')[0];
      const existing = dailySalesMap.get(date) || { total: 0, count: 0 };
      dailySalesMap.set(date, {
        total: existing.total + t.total,
        count: existing.count + 1
      });
    });
    
    const dailySales = Array.from(dailySalesMap.entries()).map(([date, data]) => ({
      date,
      total: data.total,
      transactionCount: data.count
    }));
    
    // Calculate top selling products
    const productSalesMap = new Map<string, { name: string, quantity: number, revenue: number }>();
    
    filteredTransactions.forEach(t => {
      t.items.forEach(item => {
        const existing = productSalesMap.get(item.productId) || { 
          name: item.name, 
          quantity: 0, 
          revenue: 0 
        };
        
        productSalesMap.set(item.productId, {
          name: item.name,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity)
        });
      });
    });
    
    const topProducts = Array.from(productSalesMap.entries())
      .map(([id, data]) => ({
        productId: id,
        productName: data.name,
        quantitySold: data.quantity,
        totalRevenue: data.revenue
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
    
    // Calculate cashier performance
    const cashierMap = new Map<string, { name: string, count: number, total: number }>();
    
    filteredTransactions.forEach(t => {
      const existing = cashierMap.get(t.cashierId) || { 
        name: t.cashierName, 
        count: 0, 
        total: 0 
      };
      
      cashierMap.set(t.cashierId, {
        name: t.cashierName,
        count: existing.count + 1,
        total: existing.total + t.total
      });
    });
    
    const cashierPerformance = Array.from(cashierMap.entries()).map(([id, data]) => ({
      cashierId: id,
      cashierName: data.name,
      transactionCount: data.count,
      totalSales: data.total
    }));
    
    return {
      startDate,
      endDate,
      totalSales,
      transactionCount,
      averageTransactionValue,
      salesByPaymentMethod,
      dailySales,
      topProducts,
      cashierPerformance
    };
  };
  
  return (
    <ReportContext.Provider value={{ generateReport, canAccessReports }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
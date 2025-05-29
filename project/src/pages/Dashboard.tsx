import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { Clock, DollarSign, ShoppingCart, Package, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { transactions } = useCart();
  const { products } = useProduct();
  const [todaySales, setTodaySales] = useState(0);
  const [todayTransactions, setTodayTransactions] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<number>(0);
  
  useEffect(() => {
    // Calculate today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTrans = transactions.filter(t => 
      new Date(t.timestamp) >= today
    );
    
    setTodayTransactions(todayTrans.length);
    setTodaySales(todayTrans.reduce((sum, t) => sum + t.total, 0));
    
    // Calculate low stock items
    const lowStock = products.filter(p => p.stock <= 5).length;
    setLowStockItems(lowStock);
  }, [transactions, products]);
  
  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your boutique dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Sales Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500 transform transition-transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold">${todaySales.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        {/* Transactions Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-rose-500 transform transition-transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Transactions</p>
              <p className="text-2xl font-bold">{todayTransactions}</p>
            </div>
            <div className="p-3 rounded-full bg-rose-100">
              <ShoppingCart className="h-6 w-6 text-rose-600" />
            </div>
          </div>
        </div>
        
        {/* Inventory Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500 transform transition-transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        {/* Low Stock Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500 transform transition-transform hover:scale-105">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockItems}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {transaction.paymentMethod}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Current Time */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow flex items-center">
        <Clock className="h-6 w-6 text-indigo-600 mr-3" />
        <div>
          <p className="text-sm text-gray-600">Current Date & Time</p>
          <p className="text-lg font-semibold">
            {new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
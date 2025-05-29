import React, { useState, useEffect } from 'react';
import { useCart, Transaction } from '../context/CartContext';
import { useReport, Report } from '../context/ReportContext';
import { CalendarRange, Download, BarChart3, PieChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Reports: React.FC = () => {
  const { transactions } = useCart();
  const { generateReport, canAccessReports } = useReport();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [report, setReport] = useState<Report | null>(null);
  
  useEffect(() => {
    // If user doesn't have permission to access reports, redirect to dashboard
    if (!canAccessReports) {
      navigate('/dashboard');
    }
    
    // Set default date range to this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];
    
    setStartDate(firstDayOfMonth);
    setEndDate(today);
  }, [canAccessReports, navigate]);
  
  useEffect(() => {
    if (startDate && endDate) {
      generateAndSetReport();
    }
  }, [startDate, endDate]);
  
  const generateAndSetReport = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const generatedReport = generateReport(transactions, start, end);
    setReport(generatedReport);
  };
  
  const downloadReport = () => {
    if (!report) return;
    
    // Create a formatted report for download
    const reportData = {
      reportPeriod: `${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`,
      totalSales: report.totalSales,
      transactionCount: report.transactionCount,
      averageTransactionValue: report.averageTransactionValue,
      salesByPaymentMethod: report.salesByPaymentMethod,
      dailySales: report.dailySales,
      topProducts: report.topProducts,
      cashierPerformance: report.cashierPerformance
    };
    
    // Convert to JSON and create a download link
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `boutique-report-${startDate}-to-${endDate}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  if (!canAccessReports) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        {report && (
          <button 
            onClick={downloadReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        )}
      </div>
      
      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center mb-4">
          <CalendarRange className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="font-semibold">Select Date Range</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min={startDate}
            />
          </div>
        </div>
        
        <button
          onClick={generateAndSetReport}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Generate Report
        </button>
      </div>
      
      {report ? (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
              <p className="text-2xl font-bold mt-1">${report.totalSales.toFixed(2)}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
              <p className="text-2xl font-bold mt-1">{report.transactionCount}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
              <p className="text-2xl font-bold mt-1">${report.averageTransactionValue.toFixed(2)}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Period</h3>
              <p className="text-xl font-bold mt-1">
                {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="font-semibold">Sales by Payment Method</h2>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.salesByPaymentMethod.map((method) => (
                      <tr key={method.method}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {method.method.replace('-', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {method.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${method.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="font-semibold">Top Selling Products</h2>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.topProducts.length > 0 ? (
                      report.topProducts.map((product) => (
                        <tr key={product.productId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.quantitySold}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.totalRevenue.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No products sold in this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Daily Sales */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="font-semibold">Daily Sales</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sales
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.dailySales.length > 0 ? (
                    report.dailySales.map((day) => (
                      <tr key={day.date}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {day.transactionCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${day.total.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        No sales data available for this period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Cashier Performance (Only for Admin and Manager) */}
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="font-semibold">Cashier Performance</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cashier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Sale
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.cashierPerformance.length > 0 ? (
                      report.cashierPerformance.map((cashier) => (
                        <tr key={cashier.cashierId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cashier.cashierName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cashier.transactionCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${cashier.totalSales.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(cashier.totalSales / cashier.transactionCount).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No cashier data available for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-indigo-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Report Generated</h2>
          <p className="text-gray-600">
            Select a date range and click "Generate Report" to see your sales data.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
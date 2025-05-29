import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Store, Receipt, User, Shield, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Store Information
  const [storeName, setStoreName] = useState('My Boutique');
  const [storeAddress, setStoreAddress] = useState('123 Fashion Street');
  const [storePhone, setStorePhone] = useState('(123) 456-7890');
  const [storeEmail, setStoreEmail] = useState('contact@boutique.com');
  
  // Receipt Settings
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxDetails, setShowTaxDetails] = useState(true);
  const [receiptFooterText, setReceiptFooterText] = useState('Thank you for shopping with us!');
  
  // Check if user has permission to access settings
  const canAccessSettings = user?.role === 'admin' || user?.role === 'manager';
  
  // Redirect if user doesn't have permission
  if (!canAccessSettings) {
    navigate('/dashboard');
    return null;
  }
  
  const handleSaveSettings = () => {
    // In a real app, this would save to a database or API
    toast.success('Settings saved successfully');
    
    // For demo, we could save to localStorage
    const settings = {
      store: {
        name: storeName,
        address: storeAddress,
        phone: storePhone,
        email: storeEmail
      },
      receipt: {
        showLogo,
        showTaxDetails,
        footerText: receiptFooterText
      }
    };
    
    localStorage.setItem('boutiqueSettings', JSON.stringify(settings));
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your boutique settings</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Store Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <Store className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="font-semibold">Store Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Receipt Settings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <Receipt className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="font-semibold">Receipt Settings</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                  Show Logo on Receipt
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTaxDetails"
                  checked={showTaxDetails}
                  onChange={(e) => setShowTaxDetails(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showTaxDetails" className="ml-2 block text-sm text-gray-700">
                  Show Tax Details
                </label>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Footer Text
                </label>
                <textarea
                  value={receiptFooterText}
                  onChange={(e) => setReceiptFooterText(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* User Access (Admin Only) */}
        {user?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
              <Shield className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="font-semibold">User Access</h2>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Manage user accounts and permissions. This section is only visible to administrators.
              </p>
              
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Admin User
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      admin@boutique.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Manager User
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      manager@boutique.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Manager
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Cashier User
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      cashier@boutique.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Cashier
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
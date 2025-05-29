import React, { useState } from 'react';
import { Menu, Bell, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex justify-between items-center">
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800 md:hidden">Boutique POS</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              2
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-900 text-white">
          <nav className="py-2">
            <a href="/dashboard" className="block px-4 py-2 hover:bg-indigo-800">Dashboard</a>
            <a href="/products" className="block px-4 py-2 hover:bg-indigo-800">Products</a>
            <a href="/sales" className="block px-4 py-2 hover:bg-indigo-800">Sales</a>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <a href="/reports" className="block px-4 py-2 hover:bg-indigo-800">Reports</a>
                <a href="/settings" className="block px-4 py-2 hover:bg-indigo-800">Settings</a>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
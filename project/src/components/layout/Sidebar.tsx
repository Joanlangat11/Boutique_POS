import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  BarChart4, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      allowedRoles: ['admin', 'manager', 'cashier']
    },
    { 
      name: 'Products', 
      path: '/products', 
      icon: <ShoppingBag className="w-5 h-5" />,
      allowedRoles: ['admin', 'manager', 'cashier'] 
    },
    { 
      name: 'Sales', 
      path: '/sales', 
      icon: <Receipt className="w-5 h-5" />,
      allowedRoles: ['admin', 'manager', 'cashier']
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <BarChart4 className="w-5 h-5" />,
      allowedRoles: ['admin', 'manager']
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="w-5 h-5" />,
      allowedRoles: ['admin', 'manager']
    }
  ];
  
  return (
    <aside className="bg-indigo-900 text-white w-64 flex-shrink-0 hidden md:block overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Boutique POS</h1>
        <div className="mt-2 text-indigo-200">
          {user?.name} <span className="px-2 py-1 text-xs bg-indigo-700 rounded-full capitalize">{user?.role}</span>
        </div>
      </div>
      
      <nav className="mt-8">
        <ul>
          {navItems.filter(item => user && item.allowedRoles.includes(user.role)).map((item) => (
            <li key={item.path} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center py-3 px-4 transition-colors ${
                    isActive 
                      ? 'bg-indigo-800 text-white border-l-4 border-rose-400' 
                      : 'text-indigo-100 hover:bg-indigo-800'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-indigo-800">
        <button 
          onClick={logout}
          className="flex items-center text-indigo-100 hover:text-white w-full py-2 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
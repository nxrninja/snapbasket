import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { useAuth } from '../context/AuthContext';
import { Home, User, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { 
      id: 'workspace', 
      label: 'Home', 
      icon: Home, 
      href: '/',
      active: isActive('/')
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      href: '/profile',
      active: isActive('/profile')
    },
    { 
      id: 'stats', 
      label: 'MyOrder', 
      icon: ShoppingCart, 
      href: '/orders',
      active: isActive('/orders')
    },
  ];

  return (
    <>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white text-gray-800 p-6 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none lg:z-auto`}
      >
      
        <div className="flex items-center mb-8 lg:mb-12">
          <span className="text-2xl font-bold text-green-600">
            Snap<span className="text-red-500">B</span>asket
          </span>
        </div>

        
        <nav className="space-y-2 lg:space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-green-100 text-green-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

       
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

    
      <div className="fixed left-0 bottom-0 w-full h-20 bg-white border-t border-gray-200 lg:hidden flex items-center justify-around z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative flex flex-col items-center">
              <Link
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                  item.active ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </div>
          );
        })}
        <div className="relative flex flex-col items-center">
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-gray-600 hover:text-red-600 transition-all"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
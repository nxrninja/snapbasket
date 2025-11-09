import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartIcon from './CartIcon';
import CartPreview from './CartPreview';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            
            <a href="/" className="flex-shrink-0">
              <span className="text-lg font-bold text-gray-900 whitespace-nowrap">SnapBasket</span>
            </a>

            
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

           
            <div className="flex-shrink-0">
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      
      <CartPreview />
    </>
  );
};

export default Header;
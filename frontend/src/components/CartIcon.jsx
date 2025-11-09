import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartIcon = () => {
  const { toggleCart, totalQuantity } = useCart();

  const handleCartClick = () => {
    toggleCart();
  };

  return (
    <button 
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      onClick={handleCartClick}
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-6 h-6" />
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
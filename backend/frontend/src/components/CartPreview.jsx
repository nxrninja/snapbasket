import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag,
  ShoppingCart,
  Loader
} from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartPreview = () => {
  const { 
    items, 
    totalQuantity, 
    totalAmount, 
    isCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    closeCart,
    loading
  } = useCart();

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateCartQuantity(productId, newQuantity);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout!');
    closeCart();
  };

  const subtotal = totalAmount;
  const tax = subtotal * 0.1; 
  const total = subtotal + tax;

  if (!isCartOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
        <div className="relative ml-auto w-full max-w-md bg-white border-l border-gray-200 flex flex-col max-h-screen">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
    
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={closeCart}
      />
      
      
      <div className="relative ml-auto w-full max-w-md bg-white border-l border-gray-200 flex flex-col max-h-screen animate-in slide-in-from-right duration-300">
        
       
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            {totalQuantity > 0 && (
              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                {totalQuantity} item{totalQuantity !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add some items to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors group"
              >
               
                <div className="w-16 h-16 bg-white rounded border flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
               
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-green-600 font-bold mt-1">
                    ₹{item.price}
                  </p>
                  
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                
                  <div className="text-right text-sm text-gray-600 mt-2">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

       
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  Clear Cart
                </button>
                
                <button
                  onClick={closeCart}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPreview;
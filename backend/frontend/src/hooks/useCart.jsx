// hooks/useCart.js
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { 
  openCart, 
  closeCart, 
  toggleCart, 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  setLoading,
  setError
} from '../store/slices/cartSlice';
import { BaseUrl } from '../api/ApiUrl';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch(setLoading(true));
      const response = await makeAuthenticatedRequest(`${BaseUrl}/cart`, {
        method: "GET"
      });
      
      
      
      if (response.data && response.data.data) {
        const cartData = response.data.data;
        dispatch(clearCart());
        
        cartData.items?.forEach(item => {
          
          let productId;
          let productName;
          let productImage;
          
          if (typeof item.productId === 'object' && item.productId !== null) {
            
            productId = item.productId._id || item.productId.productid || item.productId.id;
            productName = item.productId.productname || item.productId.name || 'Unknown Product';
            productImage = item.productId.images && item.productId.images.length > 0 
              ? item.productId.images[0] 
              : '';
          } else {
            
            productId = item.productId;
            productName = item.name || 'Unknown Product';
            productImage = item.image || '';
          }
          
         
          if (productId) {
            dispatch(addItem({
              id: productId,
              name: productName,
              price: item.price,
              image: productImage,
              quantity: item.quantity
            }));
          }
        });
      }
    } catch (error) {
      
      dispatch(setError('Failed to load cart'));
    } finally {
      dispatch(setLoading(false));
    }
  };

 
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      
      dispatch(addItem(product));
      
      
      await makeAuthenticatedRequest(`${BaseUrl}/cart/product/add`, {
        method: 'POST',
        data: {
          productId: product.id,
          quantity: product.quantity || 1
        }
      });

      return Promise.resolve();
    } catch (error) {
     
     
      dispatch(removeItem(product.id));
      dispatch(setError('Failed to add item to cart'));
      return Promise.reject(error);
    }
  };

  
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
     
      dispatch(removeItem(productId));
      
      
      await makeAuthenticatedRequest(`${BaseUrl}/cart/product/remove`, {
        method: 'POST',
        data: { productId }
      });
    } catch (error) {
    
      dispatch(setError('Failed to remove item from cart'));
    }
  };

  
  const updateCartQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      
      dispatch(updateQuantity({ id: productId, quantity }));
      
      
      await makeAuthenticatedRequest(`${BaseUrl}/cart/product/add`, {
        method: 'POST',
        data: {
          productId: productId,
          quantity: quantity
        }
      });
    } catch (error) {
     
      dispatch(setError('Failed to update cart quantity'));
    }
  };

  
  const clearCartWithSync = async () => {
    if (!isAuthenticated) return;

    try {
      
      for (const item of cart.items) {
        await makeAuthenticatedRequest(`${BaseUrl}/cart/product/remove`, {
          method: 'POST',
          data: { productId: item.id }
        });
      }
      
     
      dispatch(clearCart());
    } catch (error) {
  
      dispatch(setError('Failed to clear cart'));
    }
  };

  return {
  
    ...cart,
    
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart: clearCartWithSync,
    fetchCart,
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    toggleCart: () => dispatch(toggleCart()),
  };
};
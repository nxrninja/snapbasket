// src/components/ProductCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onProductClick }) => {
  const {
    id,
    name,
    rating,
    reviewCount,
    price,
    originalPrice,
    discount,
    imageUrl,
    category,
    stock
  } = product;

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-3 h-3 ${
              index < fullStars 
                ? 'text-yellow-400 fill-current' 
                : hasHalfStar && index === fullStars
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return '₹' + price.toLocaleString('en-IN');
    }
    return price;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Handle Add to Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    try {
      const cartProduct = {
        id: id,
        name: name,
        price: price,
        image: imageUrl,
        quantity: 1
      };
      await addToCart(cartProduct);
    } catch (err) {
      alert('Failed to add item to cart');
    }
  };


  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    navigate(`/order/summary/${id}`);
  };

  
  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-sm shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 relative overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
     
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {discount}% OFF
          </span>
        </div>
      )}

      <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
        <svg className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="relative bg-white p-3 sm:p-4">
        <div className="aspect-square relative bg-gray-50 rounded-sm overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 w-full h-full"></div>
            </div>
          )}
          
          {imageError || !imageUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-400">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">No Image</span>
              </div>
            </div>
          ) : (
            <img 
              src={imageUrl} 
              alt={name}
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                margin: '0 auto',
                display: 'block'
              }}
            />
          )}

          {stock === 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
              <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-2 sm:p-3 border-t border-gray-100">
        <h3 className="text-xs sm:text-sm font-normal text-gray-800 mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2rem] sm:min-h-[2.5rem]">
          {name}
        </h3>
        
        {category && (
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-1 sm:mb-2">
            {category}
          </span>
        )}
        
        <div className="flex items-center mb-1 sm:mb-2">
          <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded-sm text-xs font-medium mr-2">
            <span className="text-xs">{rating}</span>
            <svg className="w-2.5 h-2.5 ml-0.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          {renderStars(rating)}
          <span className="ml-1 text-xs text-gray-600">({reviewCount})</span>
        </div>
        
        <div className="flex items-center mb-1 sm:mb-2">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="ml-2 text-xs text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              {discount > 0 && (
                <span className="ml-2 text-xs text-green-600 font-semibold">
                  {discount}% off
                </span>
              )}
            </>
          )}
        </div>

        <div className="text-xs text-green-600 mb-2 sm:mb-3 font-medium">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free delivery
          </span>
        </div>
        
       
        <div className="flex gap-1 sm:gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-sm transition-all duration-200 flex items-center justify-center font-medium text-xs sm:text-sm ${
              stock === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden xs:inline">ADD TO CART</span>
                <span className="xs:hidden">CART</span>
              </>
            )}
          </button>

          <button 
            onClick={handleBuyNow}
            disabled={stock === 0}
            className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-sm transition-all duration-200 flex items-center justify-center font-medium text-xs sm:text-sm ${
              stock === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <span className="hidden xs:inline">BUY NOW</span>
            <span className="xs:hidden">BUY</span>
          </button>
        </div>

        <div className="flex justify-between mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </button>
          <button className="text-xs text-gray-600 hover:text-blue-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Compare
          </button>
        </div>
      </div>

      <div className={`absolute inset-0 border border-blue-500 rounded-sm pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
};

export default ProductCard;
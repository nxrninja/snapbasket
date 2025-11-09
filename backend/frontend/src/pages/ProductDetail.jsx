import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();


  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(`${BaseUrl}/product/${productId}`);
      
      setProduct(response.data.data);
      
      if (response.data.data.images && response.data.data.images.length > 0) {
        setSelectedImage(0);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${productId}` } });
      return;
    }

    try {
      
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
      
      const productToAdd = {
        id: product.productid || product._id,
        name: product.productname,
        price: discountedPrice, 
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity: quantity
      };
      
      await addToCart(productToAdd);
      alert(`Added ${product.productname} to cart!`);
    } catch (err) {
      alert('Failed to add item to cart');
    }
  };

  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${productId}` } });
      return;
    }

    
    navigate(`/order/summary/${product.productid || product._id}`);
  };

  
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (discountPercent > 0 && discountPercent < 100) {
      return (originalPrice * (1 - discountPercent / 100)).toFixed(2);
    }
    return originalPrice;
  };

 
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return '₹' + price.toLocaleString('en-IN');
    }
    return price;
  };

 
  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-red-800 mb-2">Product Not Found</h3>
            <p className="text-red-600 mb-4">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

 
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const discountAmount = product.price - discountedPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                Home
              </button>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <button 
                onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}
                className="text-gray-500 hover:text-gray-700 capitalize"
              >
                {product.category}
              </button>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product.productname}
            </li>
          </ol>
        </nav>

       
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            
            <div className="space-y-4">
             
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center h-96">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.productname}
                    className="w-full h-full object-contain max-h-80"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>No Image Available</span>
                  </div>
                )}
              </div>

              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.productname} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            
            <div className="space-y-6">
              
              <h1 className="text-2xl font-semibold text-gray-900">
                {product.productname}
              </h1>

              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                  <span>{parseFloat(product.rating) || 0}</span>
                  <svg className="w-3 h-3 ml-1 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">
                  {product.review || 0} Ratings & Reviews
                </span>
              </div>

            
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(discountedPrice)} 
                  </span>
                  {product.price > discountedPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.price)} 
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>
                {discountAmount > 0 && (
                  <p className="text-sm text-gray-600">
                    You save: {formatPrice(discountAmount)}
                  </p>
                )}
              </div>

              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Available offers</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Special Price: Get extra ₹3000 off (price inclusive of discount)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Free delivery for Prime members
                  </li>
                </ul>
              </div>

              
              {product.productdescription && product.productdescription !== "NA" && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.productdescription}
                  </p>
                </div>
              )}

              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category</span>
                      <span className="text-gray-900 capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stock</span>
                      <span className="text-gray-900">{product.stock} units available</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Availability</span>
                      <span className={`font-medium ${product.isavailable ? 'text-green-600' : 'text-red-600'}`}>
                        {product.isavailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery</span>
                      <span className="text-green-600">Free Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-gray-900 min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>

             
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isavailable || product.stock === 0}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-6 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.isavailable || product.stock === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  BUY NOW
                </button>
              </div>

              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p>Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';

const Category = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeAuthenticatedRequest } = useAuth();

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (discountPercent > 0 && discountPercent < 100) {
      return (originalPrice * (1 - discountPercent / 100)).toFixed(2);
    }
    return originalPrice;
  };

  
  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        categories: categoryName,
        isavailable: 'true',
        limit: '20'
      });

      const response = await makeAuthenticatedRequest(`${BaseUrl}/product?${params}`);
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError('Failed to load category products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>

         
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="text-center mb-8">
          <button
            onClick={handleBackToHome}
            className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200/50 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {categoryName}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Discover amazing products in {categoryName}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Curated Collection
              </span>
            </div>
          </div>
        </div>

       
        {error ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Products
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={fetchCategoryProducts}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Try Again
                </button>
                <button
                  onClick={handleBackToHome}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {products.map((product) => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
              
              return (
                <ProductCard
                  key={product.productid || product._id}
                  product={{
                    id: product.productid || product._id,
                    name: product.productname,
                    rating: parseFloat(product.rating) || 0,
                    reviewCount: product.review || 0,
                    price: discountedPrice,
                    originalPrice: product.price,
                    discount: product.discount,
                    imageUrl: product.images && product.images.length > 0 
                      ? product.images[0] 
                      : "https://via.placeholder.com/400x400/ffffff/cccccc?text=No+Image",
                    category: product.category,
                    isavailable: product.isavailable,
                    stock: product.stock
                  }}
                  onProductClick={handleProductClick}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products in the "{categoryName}" category.
              </p>
              <button
                onClick={handleBackToHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
              >
                Browse All Categories
              </button>
            </div>
          </div>
        )}

      
        {products.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Showing {products.length} of {products.length} products in {categoryName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
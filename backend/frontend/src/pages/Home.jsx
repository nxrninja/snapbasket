import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { makeAuthenticatedRequest } = useAuth();

  
  const fetchCategories = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/catogeries`);
      
      console.log('Categories API response:', response.data);
      
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        if (response.data.data.length > 0 && typeof response.data.data[0] === 'string') {
          setCategories(response.data.data);
        } else if (response.data.data.length > 0 && response.data.data[0].category) {
          const uniqueCategories = [...new Set(response.data.data.map(product => product.category))].filter(Boolean);
          setCategories(uniqueCategories);
        }
      } else if (response.data.categories && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else {
        console.warn('Unexpected categories response structure:', response.data);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  
  const fetchFeaturedProducts = async () => {
    try {
      const params = new URLSearchParams({
        sort: '-discount,-rating',
        limit: '20',
        minDiscount: '15',
        isavailable: 'true',
        inStock: 'true'
      });

      const response = await makeAuthenticatedRequest(`${BaseUrl}/product?${params}`);
      setFeaturedProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load featured products');
    }
  };

  
  const fetchTrendingProducts = async () => {
    try {
      const params = new URLSearchParams({
        sort: '-rating,-review',
        limit: '16',
        minRating: '4.0',
        isavailable: 'true',
        inStock: 'true'
      });

      const response = await makeAuthenticatedRequest(`${BaseUrl}/product?${params}`);
      setTrendingProducts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching trending products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };
  
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (discountPercent > 0 && discountPercent < 100) {
      return (originalPrice * (1 - discountPercent / 100)).toFixed(2);
    }
    return originalPrice;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCategoriesLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchFeaturedProducts(),
        fetchTrendingProducts()
      ]);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
         
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>

         
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="flex flex-wrap justify-center gap-3">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg w-24 h-16"></div>
              ))}
            </div>
          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-3">
                <div className="h-32 sm:h-40 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {!categoriesLoading && categories.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
              Shop by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.slice(0, 10).map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white rounded-lg shadow-sm px-3 py-2 sm:px-4 sm:py-2 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-500 min-w-[90px] sm:min-w-[100px] text-center capitalize hover:bg-blue-50"
                >
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        
        {featuredProducts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Deals of the Day
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {featuredProducts.slice(0, 12).map((product) => {
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
                        : "https://via.placeholder.com/400?text=No+Image",
                      category: product.category,
                      isavailable: product.isavailable,
                      stock: product.stock
                    }}
                    onProductClick={handleProductClick}
                  />
                );
              })}
            </div>
          </div>
        )}

       
        {trendingProducts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Trending Products
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {trendingProducts.slice(0, 12).map((product) => {
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
                        : "https://via.placeholder.com/400?text=No+Image",
                      category: product.category,
                      isavailable: product.isavailable,
                      stock: product.stock
                    }}
                    onProductClick={handleProductClick}
                  />
                );
              })}
            </div>
          </div>
        )}

        
        {featuredProducts.length > 12 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              More Products
            </h2>
            
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {featuredProducts.slice(12).map((product) => {
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
                        : "https://via.placeholder.com/400?text=No+Image",
                      category: product.category,
                      isavailable: product.isavailable,
                      stock: product.stock
                    }}
                    onProductClick={handleProductClick}
                  />
                );
              })}
            </div>
          </div>
        )}

     
        {error && featuredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-red-50 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">
                Unable to load products
              </h3>
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 sm:mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        
        {!loading && featuredProducts.length === 0 && trendingProducts.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
                No Products Available
              </h3>
              <p className="text-yellow-600 text-sm sm:text-base">
                No products found with current filters. Try adjusting the criteria.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
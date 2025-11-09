import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { makeAuthenticatedRequest } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  const fetchSearchResults = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        q: searchQuery,
        sort: '-rating,-review',
        limit: '50',
        isavailable: 'true',
        inStock: 'true'
      });

      const response = await makeAuthenticatedRequest(`${BaseUrl}/product?${params}`);
      
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setTotalResults(response.data.total || response.data.data.length);
      } else {
        setProducts([]);
        setTotalResults(0);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to load search results');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (discountPercent > 0 && discountPercent < 100) {
      return (originalPrice * (1 - discountPercent / 100)).toFixed(2);
    }
    return originalPrice;
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
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
       
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {totalResults > 0 
                ? `Found ${totalResults} results for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}
        </div>

       
        {products.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
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
        ) : (
          !loading && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {query 
                    ? `We couldn't find any products matching "${query}"`
                    : 'Please enter a search term to find products'
                  }
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )
        )}

       
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Search Error
              </h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchSearchResults(query)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
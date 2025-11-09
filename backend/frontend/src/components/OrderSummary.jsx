import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';

const OrderSummary = () => {
  const { productid } = useParams();
  const navigate = useNavigate();
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addressValid, setAddressValid] = useState(false);

  
  const isValidAddress = (address) => {
    if (!address) return false;
    if (typeof address !== 'object') return false;
    
    
    const hasRequiredFields = (
      address.street && 
      address.street.trim() !== '' &&
      address.city && 
      address.city.trim() !== '' &&
      address.state && 
      address.state.trim() !== '' &&
      address.zip && 
      address.zip.trim() !== ''
    );

    console.log('Address validation check:', {
      address,
      hasRequiredFields,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip
    });

    return hasRequiredFields;
  };

  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(`${BaseUrl}/order/summary/${productid}`);
      
      if (!response.data.product) throw new Error('Product not found');
      
      console.log('Backend response:', response.data);
      
     
      const userAddress = response.data.address;
      const isAddressValid = isValidAddress(userAddress);
      
      console.log('Address validation result:', isAddressValid);
      
      if (!isAddressValid) {
        setAddressValid(false);
       
        const addressArray = [];
        setOrderData({
          product: response.data.product,
          address: addressArray
        });
      } else {
        setAddressValid(true);
    
        const addressArray = [userAddress];
        
        setOrderData({
          product: response.data.product,
          address: addressArray
        });
        
        setSelectedAddress(userAddress);
      }
      
    } catch (err) {
      console.error('Error fetching order summary:', err);
      setError(err.response?.data?.message || 'Failed to load order summary');
    } finally {
      setLoading(false);
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      
      if (!selectedAddress || !isValidAddress(selectedAddress)) {
        alert('Please add a complete delivery address with city, state, and zip code to continue');
        navigate('/profile');
        return;
      }

      const discountedPrice = calculateDiscountedPrice(orderData.product.price, orderData.product.discount);
      
      const orderPayload = {
        productId: productid,
        quantity: quantity,
        address: selectedAddress,
        paymentMethod: 'cod', 
        totalAmount: discountedPrice * quantity
      };

      console.log('Placing order with payload:', orderPayload);

      const response = await makeAuthenticatedRequest(
        `${BaseUrl}/order/place/single`,
        {
          method: 'POST',
          data: orderPayload
        }
      );

      if (response.data && response.data.success) {
        setCurrentStep(3); 
      } else {
        throw new Error('Failed to place order');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message);
      alert('Failed to place order. Please try again.');
    }
  };

  
  const handleContinueToAddress = () => {
    if (!orderData.address || orderData.address.length === 0 || !addressValid) {
      alert('Please add a complete delivery address with city, state, and zip code to continue');
      navigate('/profile');
      return;
    }
    setCurrentStep(2);
  };

  useEffect(() => {
    if (productid) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: `/order/summary/${productid}` } });
        return;
      }
      fetchOrderSummary();
    }
  }, [productid, isAuthenticated, navigate]);

 
  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity < 1) return 1;
      if (orderData && newQuantity > orderData.product.stock) return orderData.product.stock;
      return newQuantity;
    });
  };

 
  const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount / 100) : price;
  };

  const steps = [
    { number: 1, title: 'Order Summary' },
    { number: 2, title: 'Address' },
    { number: 3, title: 'Confirmation' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 rounded-lg p-6 w-full max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Order
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(orderData.product.price, orderData.product.discount);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center w-full sm:w-auto">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                } font-semibold text-sm sm:text-base`}>
                  {step.number}
                </div>
                <span className={`ml-3 text-sm sm:text-base font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 sm:w-16 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
                {index < steps.length - 1 && (
                  <div className={`sm:hidden ml-auto w-8 h-0.5 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

       
        {(!addressValid || !orderData.address || orderData.address.length === 0) && currentStep === 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete your delivery address
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please add a complete delivery address with city, state, and zip code to place your order.
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Add Address Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {currentStep === 1 && orderData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
              <img
                src={orderData.product.image}
                alt={orderData.product.name}
                className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg mx-auto sm:mx-0"
              />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {orderData.product.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3">
                  {orderData.product.description}
                </p>
                
                
                <div className="mb-4">
                  <span className={`text-sm font-medium ${
                    orderData.product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {orderData.product.stock > 0 ? `In Stock (${orderData.product.stock} available)` : 'Out of Stock'}
                  </span>
                </div>
                
               
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 text-lg"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-gray-900 min-w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 text-lg"
                      disabled={quantity >= orderData.product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹{discountedPrice * quantity}
                  </span>
                  {orderData.product.discount > 0 && (
                    <>
                      <span className="text-base sm:text-lg text-gray-500 line-through">
                        ₹{orderData.product.price * quantity}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-1 rounded">
                        Save {orderData.product.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base sm:text-lg font-semibold">Total Amount</span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  ₹{discountedPrice * quantity}
                </span>
              </div>
              
              <button
                onClick={handleContinueToAddress}
                disabled={!addressValid || !orderData.address || orderData.address.length === 0}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg ${
                  addressValid && orderData.address && orderData.address.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {addressValid && orderData.address && orderData.address.length > 0 
                  ? 'Continue to Address' 
                  : 'Add Address to Continue'}
              </button>
            </div>
          </div>
        )}

        
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Select Delivery Address</h2>
            
            {orderData.address && orderData.address.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 mb-6">
                {orderData.address.map((address, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                      selectedAddress === address 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                          {address.type || 'Delivery Address'}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-1">{address.street}</p>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {address.city}, {address.state} - {address.zip}
                        </p>
                        {address.landmark && (
                          <p className="text-gray-500 text-sm mt-1">Landmark: {address.landmark}</p>
                        )}
                      </div>
                      {selectedAddress === address && (
                        <div className="text-blue-600 ml-4">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-yellow-800">Address Required</h3>
                </div>
                <p className="text-yellow-700 mt-2 text-sm sm:text-base">
                  No valid address found. Please add a complete delivery address with city, state, and zip code to continue.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-3 w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm sm:text-base"
                >
                  Add Address Now
                </button>
              </div>
            )}

           
            <div className="mb-6">
              <button
                onClick={() => navigate('/profile')}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors text-sm sm:text-base"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Address
                </div>
              </button>
            </div>

            
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Cash on Delivery</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Pay when you receive the order</p>
                </div>
              </div>
            </div>

           
            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Order Summary</h3>
              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Price ({quantity} items)</span>
                  <span>₹{orderData.product.price * quantity}</span>
                </div>
                {orderData.product.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{(orderData.product.price * quantity - discountedPrice * quantity).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-base sm:text-lg">
                  <span>Total Amount</span>
                  <span>₹{discountedPrice * quantity}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg order-2 sm:order-1"
              >
                Back
              </button>
              <button
                onClick={placeOrder}
                disabled={!selectedAddress}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors text-base sm:text-lg order-1 sm:order-2 ${
                  selectedAddress
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Place Order
              </button>
            </div>
          </div>
        )}

     
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Your order has been confirmed and will be delivered soon.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Payment Method: Cash on Delivery
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Delivery Address: {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.zip}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Estimated Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base sm:text-lg w-full sm:w-auto"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors text-base sm:text-lg w-full sm:w-auto"
              >
                View Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
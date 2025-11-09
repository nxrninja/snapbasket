import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../api/ApiUrl';

const OTPBox = ({ formData, setShowOTP }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BaseUrl}/verify-otp`, { 
        email: formData.email,
        otp: otp
      });
      if (response.status === 201) {
        alert('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 0);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendCooldown(30);
    try {
      await axios.post(`${BaseUrl}/registration`, formData);
      alert('OTP resent successfully!');
    } catch (error) {
      alert('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          Verify Your Email
        </h3>
        <p className="text-gray-300 text-sm">Enter the OTP sent to your email</p>
      </div>
      
      <form onSubmit={handleOTPSubmit} className="space-y-6">
        <div className="group">
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 backdrop-blur-sm group-hover:border-white/20 text-center text-lg tracking-widest"
              required
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${
            isLoading 
              ? 'bg-purple-600/50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
          }`}
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-6 w-6 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span className="text-white">Verifying...</span>
            </>
          ) : (
            <span className="text-white relative z-10">Verify OTP</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={handleResendOTP}
          disabled={resendCooldown > 0}
          className={`text-sm transition-all duration-300 ${
            resendCooldown > 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-purple-300 hover:text-white font-semibold'
          }`}
        >
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    username: '', 
    fullname: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${BaseUrl}/registration`, formData);
      if (response.status === 200) {
        setShowOTP(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      console.error('err');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-rose-400 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-sky-400 to-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse-slow animation-delay-4000"></div>

     
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 hover:shadow-purple-500/10 hover:scale-[1.02]">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10 rounded-t-3xl overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[loading_1.5s_ease-in-out_infinite] rounded-r-full"></div>
          </div>
        )}

       
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            SnapBasket
          </h2>
          <p className="text-gray-300 text-sm">
            {!showOTP ? 'Create your account to get started' : 'Almost there! Verify your email'}
          </p>
        </div>

      
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {!showOTP ? (
          <form onSubmit={handleSubmit} className="space-y-6">
         
            <div className="group">
              <label htmlFor="email" className="block text-gray-300 mb-3 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 backdrop-blur-sm group-hover:border-white/20"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="username" className="block text-gray-300 mb-3 font-medium">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 backdrop-blur-sm group-hover:border-white/20"
                  placeholder="Choose a username"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

          
            <div className="group">
              <label htmlFor="fullname" className="block text-gray-300 mb-3 font-medium">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 backdrop-blur-sm group-hover:border-white/20"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

           
            <div className="group">
              <label htmlFor="password" className="block text-gray-300 mb-3 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-300 backdrop-blur-sm group-hover:border-white/20"
                  placeholder="Create a strong password"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

           
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${
                isLoading 
                  ? 'bg-purple-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  <span className="text-white">Creating Account...</span>
                </>
              ) : (
                <span className="text-white relative z-10">Create Account</span>
              )}
            </button>
          </form>
        ) : (
          <OTPBox formData={formData} setShowOTP={setShowOTP} />
        )}

        {/* Login link */}
        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-purple-300 hover:text-white font-semibold underline underline-offset-4 decoration-purple-400/50 hover:decoration-purple-300 transition-all duration-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
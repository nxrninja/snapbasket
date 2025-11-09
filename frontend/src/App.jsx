import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home.jsx';


import PrivateLayout from './layouts/PrivateLayout.jsx';
import   { OrderDetails }  from './pages/OrderDetails.jsx';
import { Profile } from './pages/Profile.jsx';
import Category from './pages/Category.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import OrderSummary from './components/OrderSummary.jsx';
import { useCart } from './hooks/useCart.jsx';
import { Orders } from './pages/Orders.jsx';
import SearchResults from './pages/SearchResults.jsx';

function AuthenticatedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }
  

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  return isAuthenticated
    ? <Navigate to="/" replace state={{ from: location }} />
    : children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><Signup /></PublicRoute>
      } />
      <Route path="/" element={
        <AuthenticatedRoute><PrivateLayout /></AuthenticatedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/order/summary/:productid" element={<OrderSummary />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="text-white text-center mt-20">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
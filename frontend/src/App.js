import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUsersManagePage from './pages/AdminUsersManagePage';
import AdminLoginPage from './pages/AdminLoginPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import PaymentPage from './pages/PaymentPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import SizeGuidePage from './pages/SizeGuidePage';
import ContactPage from './pages/ContactPage';


import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              <Route path="payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
              <Route path="order-success/:id" element={<OrderSuccessPage />} />

              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="return-policy" element={<ReturnPolicyPage />} />
              <Route path="size-guide" element={<SizeGuidePage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminOrdersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users-manage" element={<AdminUsersManagePage />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

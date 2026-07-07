import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/home'
import About from './pages/about'
import ReturnPolicy from './pages/returnPolicy'
import Disclaimer from './pages/disclaimer'
import Login from './pages/login'
import Register from './pages/register'
import VerifyEmail from './pages/verifyEmail'
import ProductDetail from './pages/productDetail'
import Cart from './pages/cart'
import Shop from './pages/shop'
import Profile from './pages/profile'
import Checkout from './pages/checkout'
import AdminDashboard from './admin/adminDashboard'
import AddProduct from './admin/addProduct'
import AdminProducts from './admin/adminProducts'
import AdminOrders from './admin/adminOrders'
import AdminUsers from './admin/adminUsers'
import EditProduct from './admin/editProduct'
import OrderSuccess from './pages/orderSuccess'
function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<h1><About /></h1>} />
          <Route path="/return" element={<h1><ReturnPolicy /></h1>} />
          <Route path="/disclaimer" element={<h1><Disclaimer /></h1>} />
          <Route path="/login" element={<h1><Login /></h1>} />
          <Route path="/register" element={<h1><Register /></h1>} />
          <Route path="/verify-email" element={<h1><VerifyEmail /></h1>} />
          <Route path="/products/:id" element={<h1><ProductDetail /></h1>} />
          <Route path="/cart" element={<h1><Cart /></h1>} />
          <Route path="/shop" element={<h1><Shop /></h1>} />
          <Route path="/profile" element={<h1><Profile /></h1>} />
          <Route path="/checkout" element={<h1><Checkout /></h1>} />
          <Route path="/admin" element={<h1><AdminDashboard /></h1>} />
          <Route path="/admin/add-product" element={<h1><AddProduct /></h1>} />
          <Route path="/admin/products" element={<h1><AdminProducts /></h1>} />
          <Route path="/admin/orders" element={<h1><AdminOrders /></h1>} />
          <Route path="/admin/users" element={<h1><AdminUsers /></h1>} />
          <Route path="/admin/edit-product/:id" element={<h1><EditProduct /></h1>} />
          <Route path="/ordersuccess" element={<h1><OrderSuccess /></h1>} />
        </Routes>
        <Footer />
      </Router>    
  )
};

export default App

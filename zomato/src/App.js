import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// ✅ 1. Auth & User Pages Imports
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import Register from './Pages/Register';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Menu from './Pages/Menu';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import UserProfile from './Pages/UserProfile';
import MyOrder from './Pages/MyOrder'; 
import Wishlist from './Pages/Wishlist'; 
import Blog from './Pages/Blog';
import BlogDetail from './Pages/BlogDetail';
import BookTable from './Pages/BookTable';
import PrivateEvent from './Pages/PrivateEvent';
import Contact from './Pages/Contact';

// ✅ 2. Admin Pages Imports
import Category from './Admin/Category';
import Addproduct from './Admin/Addproduct';
import ProductList from './Admin/ProductList';
import ManageSlider from './Admin/ManageSlider';
import ManageFlashDeal from './Admin/ManageFlashDeal';
import AddBlog from './Admin/AddBlog';
import ChefAdmin from './Admin/ChefAdmin'; 
import AdminTableDashboard from './Admin/AdminTableDashboard';
import PrivateEventAdmin from './Admin/PrivateEventAdmin';
import AdminDashboard from './Admin/AdminDashboard';
import AdminInquiry from './Admin/AdminInquiry';

// ✅ 3. Components & Context Imports
import Header from './Components/Header';
import Footer from './Components/Footer';
import AdminSidebar from './Admin/AdminSidebar'; 
import { CartProvider } from './context/CartContext';
import AdminReviewApproval from './Admin/AdminReviewApproval';




function Layout() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const adminRoutes = [
    "/category", "/addproduct", "/productlist", "/manageslider", 
    "/manageflashdeal", "/addblog", "/chefadmin", 
    "/admintabledashboard", "/privateeventadmin", "/admindashboard", 
    "/admininquiry", "/adminreviewapproval"
  ];

  const isAdminPage = adminRoutes.includes(path);
  const isAuthPage = ["/login", "/register", "/forgotpassword"].includes(path);
  const showHeaderFooter = !isAdminPage && !isAuthPage;

  return (
    <div style={{ display: isAdminPage ? 'flex' : 'block', background: isAdminPage ? '#050505' : 'inherit' }}>
      
      {isAdminPage && <AdminSidebar />}

      <div style={{
        flex: 1,
        marginLeft: isAdminPage ? '260px' : '0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowX: 'hidden'
      }}>

        {showHeaderFooter && <Header />}

        <main style={{ flex: 1 }}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />

            {/* User */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/blog" element={<Blog />} /> 
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/myorder" element={<MyOrder />} />   
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/booktable" element={<BookTable />} />
            <Route path="/privateevent" element={<PrivateEvent />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin */}
            <Route path="/category" element={<Category />} />
            <Route path="/addproduct" element={<Addproduct />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/manageslider" element={<ManageSlider />} />
            <Route path="/manageflashdeal" element={<ManageFlashDeal />} />
            <Route path="/addblog" element={<AddBlog />} />
            <Route path="/chefadmin" element={<ChefAdmin />} /> 
            <Route path="/admintabledashboard" element={<AdminTableDashboard />} />
            <Route path="/privateeventadmin" element={<PrivateEventAdmin />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/admininquiry" element={<AdminInquiry />} />            
            <Route path="/adminreviewapproval" element={<AdminReviewApproval />} />            

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {showHeaderFooter && <Footer />}
      </div>
    </div>
  );
}

// ✅ Sabse zaruri: App function ko export karna
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
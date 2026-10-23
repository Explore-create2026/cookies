import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect, useState } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Customer Pages
import Layout from './components/layout/Layout';
import HomePage from './pages/shop/HomePage';
import ProductList from './pages/shop/ProductList';
import ProductDetail from './pages/shop/ProductDetail';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderTracking from './pages/shop/OrderTracking';
import CustomerDashboard from './pages/shop/CustomerDashboard';
import AuthPage from './pages/auth/AuthPage';
import CustomCake from './pages/shop/CustomCake';
import AboutPage from './pages/shop/AboutPage';
import GalleryPage from './pages/shop/GalleryPage';
import WishlistPage from './pages/shop/WishlistPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import KitchenDashboard from './pages/admin/KitchenDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminStaff from './pages/admin/AdminStaff';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  const { isAdmin, isStaff, isAuthenticated, setUser } = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as any);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (!authInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer / Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track/:orderId" element={<OrderTracking />} />
          <Route path="custom-cake" element={<CustomCake />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route 
            path="dashboard" 
            element={isAuthenticated ? <CustomerDashboard /> : <Navigate to="/auth" />} 
          />
          <Route path="auth" element={<AuthPage />} />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isStaff ? <AdminLayout /> : <Navigate to="/auth?admin=true" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="kitchen" element={<KitchenDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="expenses" element={<AdminExpenses />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

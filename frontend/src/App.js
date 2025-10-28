// src/App.js

import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import axios from "axios";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import NewArrivals from "./pages/NewArrivals";
import InfluencerPicks from "./pages/InfluencerPicks";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import CartPage from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

const API_BASE_URL = "http://localhost:5000/api";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const openAuthModal = () => setIsAuthModalOpen(true);

  // --- Logout Handler ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    toast({
      title: "Logged out 👋",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  // --- Handle Auth Success ---
  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  }, []);

  // --- Fetch User Profile ---
  const fetchUserProfile = useCallback(
    async (token) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const realUser = response.data.user;
        setUser(realUser);
        localStorage.setItem("user", JSON.stringify(realUser));

        toast({
          title: "Login Successful! 🎉",
          description: `Welcome back, ${realUser.name || realUser.email}!`,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        handleLogout();
        toast({
          title: "Login Error",
          description: "Failed to load user profile. Please log in again.",
          variant: "destructive",
        });
      }
    },
    [handleLogout, toast]
  );

  // --- OAuth Token Handling ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const userEmail = searchParams.get("email");

    if (token && !user) {
      console.log("OAuth token found. Storing and initiating user fetch.");

      localStorage.setItem("token", token);

      if (userEmail) {
        const tempUser = { email: decodeURIComponent(userEmail) };
        setUser(tempUser);
        localStorage.setItem("user", JSON.stringify(tempUser));
      }

      fetchUserProfile(token);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname, fetchUserProfile, user]);

  // --- Restore User from LocalStorage (Fix) ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const persistedUser = JSON.parse(userData);
        setUser(persistedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        handleLogout();
      }
    }
    setLoadingUser(false);
  }, [handleLogout]);

  // --- Axios Interceptors ---
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
          toast({
            title: "Session Expired 🔒",
            description:
              "Your session has expired or is invalid. Please login again.",
            variant: "destructive",
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [toast, handleLogout]);

  // --- Fetch Cart for Logged-in User ---
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token && user) {
        try {
          const response = await axios.get(`${API_BASE_URL}/cart`);
          setCart(response.data.items || []);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      } else {
        setCart([]);
      }
    };
    fetchCart();
  }, [user]);

  // --- Placeholder Actions ---
  const addToCart = async (product) => {
    console.log("Added to cart:", product);
  };
  const toggleWishlist = (productId) => {
    console.log("Toggled wishlist for:", productId);
  };
  const handleCartClick = () => {
    console.log("Cart button clicked.");
  };

  // --- Common Props ---
  const commonProps = {
    cart,
    wishlist,
    onAddToCart: addToCart,
    onToggleWishlist: toggleWishlist,
    onCartClick: handleCartClick,
    user,
    onLogout: handleLogout,
    onAuthSuccess: handleAuthSuccess,
    onRequireAuth: openAuthModal,
  };

  // --- Show loading while user data is restoring ---
  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={handleCartClick}
        user={user}
        onLogout={handleLogout}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home {...commonProps} />} />
          <Route path="/shop" element={<Shop {...commonProps} />} />
          <Route path="/new-arrivals" element={<NewArrivals {...commonProps} />} />
          <Route
            path="/influencer-picks"
            element={<InfluencerPicks {...commonProps} />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage {...commonProps} />} />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                onRequireAuth={openAuthModal}
                onAddToCart={addToCart}
              />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={user ? <Profile {...commonProps} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/checkout"
            element={
              user ? (
                <Checkout cart={cart} user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/orders" element={<Orders user={user} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// --- Main App Component ---
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;

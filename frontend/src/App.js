import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import axios from 'axios';




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
import Orders from "./pages/Orders"; // Add this import

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Axios interceptor for auth token
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive"
          });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [toast]);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('access_token');
      if (token && user) {
        try {
          const response = await axios.get('http://localhost:5000/api/cart');
          setCart(response.data.items || []);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // If not logged in, use local cart temporarily
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          setCart(cart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ));
        } else {
          setCart([...cart, { ...product, quantity: 1 }]);
        }
        
        toast({
          title: "Added to cart!",
          description: `${product.name} has been added to your cart.`,
        });
        return;
      }

      // If logged in, save to backend
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product.id,
        quantity: 1,
        size: product.sizes?.[0] || 'M',
        color: product.colors?.[0] || 'Black'
      });

      if (response.data) {
        setCart(response.data.items || []);
        
        toast({
          title: "Added to cart!",
          description: `${product.name} has been added to your cart.`,
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Added to wishlist!",
        description: "Item has been added to your wishlist.",
      });
    }
  };

  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: `You have ${cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart.`,
    });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
    setUser(null);
    setCart([]);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const commonProps = {
    cart,
    wishlist,
    onAddToCart: addToCart,
    onToggleWishlist: toggleWishlist,
    onCartClick: handleCartClick,
    user,
    onLogout: handleLogout,
    onAuthSuccess: handleAuthSuccess,
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Header 
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            onCartClick={handleCartClick}
            user={user}
            onLogout={handleLogout}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home {...commonProps} />} />
              <Route path="/shop" element={<Shop {...commonProps} />} />
              <Route path="/new-arrivals" element={<NewArrivals {...commonProps} />} />
              <Route path="/influencer-picks" element={<InfluencerPicks {...commonProps} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile {...commonProps} />} />
              <Route path="/auth" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
              <Route path="/checkout" element={user ? <Checkout cart={cart} user={user} /> : <Navigate to="/auth" replace />} />
              <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/auth" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
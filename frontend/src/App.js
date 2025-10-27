// src/App.js

import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import axios from 'axios';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages (Assuming all these exist)
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


// Base URL for the backend
const API_BASE_URL = 'http://localhost:5000/api'; 

// Custom wrapper component to access router hooks inside BrowserRouter
const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 

    const openAuthModal = () => setIsAuthModalOpen(true); 

    // --- Core Authentication Functions ---

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setCart([]); // Clear local cart state on logout
        toast({
            title: "Logged out 👋",
            description: "You have been successfully logged out.",
        });
    }, [toast]);
    
    const handleAuthSuccess = useCallback((userData) => {
        setUser(userData);
    }, []);

    // Function to Fetch User Profile after token receipt (used for both OAuth and persistence check)
    const fetchUserProfile = useCallback(async (token) => {
       try {
            // ... attempt to fetch profile ...
            const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            
            const realUser = response.data.user; 
            
            // Set the REAL user data in state and localStorage
            setUser(realUser);
            localStorage.setItem('user', JSON.stringify(realUser));

            toast({
                title: "Login Successful! 🎉",
                description: `Welcome back, ${realUser.name || realUser.email}!`,
            });
            
        }catch (error) {
            console.error('Failed to fetch user profile:', error);
            // If the fetch fails (e.g., 401, 500, or network error), this block runs.
            handleLogout(); 
            toast({
                title: "Login Error",
                description: "Failed to load user profile. Please log in again.", // This is the message you see.
                variant: "destructive"
            });
        }
    }, [handleLogout, toast]);
    
    // --- Initial Load & OAuth Handling ---

    // 1. Google OAuth Token Handler (Checks URL for token and initiates profile fetch)
    useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const userEmail = searchParams.get('email');
    
    // 🔑 ADDED user check: Only process OAuth token if we don't already have a logged-in user
    if (token && !user) {
        console.log("OAuth token found. Storing and initiating user fetch.");
        
        // 1. Store the token
        localStorage.setItem('token', token);
        
        // 2. Set temporary user state (optional, for fast UI response)
        if (userEmail) {
            const tempUser = { email: decodeURIComponent(userEmail) };
            setUser(tempUser);
            localStorage.setItem('user', JSON.stringify(tempUser));
        }

        // 3. Immediately trigger the full profile fetch
        fetchUserProfile(token);

        // 4. Clean the URL to hide the token/email
        // This must be done inside the block where the token is handled.
        navigate(location.pathname, { replace: true });
    }
}, [location.search, navigate, location.pathname, fetchUserProfile, user]);
    // 2. Load User from localStorage on App Start (Persistence Check)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        // Only load if token and user data exist, and user state is not set yet (to avoid unnecessary re-runs)
        if (token && userData && !user) { 
            try {
                const persistedUser = JSON.parse(userData);
                setUser(persistedUser);
                
                // Optional: Re-validate token on page load to check for expiration 
                // Uncommenting the line below will re-fetch the user on every page load with a token.
                // fetchUserProfile(token); 
                
            } catch (error) {
                console.error('Error parsing user data:', error);
                handleLogout();
            }
        }
    }, [user, handleLogout, fetchUserProfile]);


    // --- Axios Interceptors ---

    useEffect(() => {
        // Request interceptor: Attach token to every outgoing request
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor: Handle 401 Unauthorized errors (token expired/invalid)
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    handleLogout(); 
                    toast({
                        title: "Session Expired 🔒",
                        description: "Your session has expired or is invalid. Please login again.",
                        variant: "destructive"
                    });
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [toast, handleLogout]);

    // --- Cart/Wishlist Fetch ---

    // Fetch cart from backend when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token');
            if (token && user) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/cart`);
                    setCart(response.data.items || []); 
                } catch (error) {
                    console.error('Failed to fetch cart:', error);
                    // Cart fetch failure is not critical enough to force logout, just log the error.
                }
            } else {
                setCart([]); // Clear cart if no user/token
            }
        };

        fetchCart();
    }, [user]);

    // --- Action Handlers (Placeholders) ---
    const addToCart = async (product) => { console.log("Added to cart:", product); /* ... */ };
    const toggleWishlist = (productId) => { console.log("Toggled wishlist for:", productId); /* ... */ };
    const handleCartClick = () => { console.log("Cart button clicked."); /* ... */ };
    
    // --- Common Props for Routes ---
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

    // --- JSX Routing ---
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
    <Route path="/influencer-picks" element={<InfluencerPicks {...commonProps} />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/cart" element={<CartPage {...commonProps} />} /> 
    <Route path="/product/:id" element={<ProductDetails onRequireAuth={openAuthModal} onAddToCart={addToCart} />} />
    
    {/* Protected Routes: Check for 'user' object before rendering */}
    <Route 
        path="/profile" 
        element={user ? <Profile {...commonProps} /> : <Navigate to="/" replace />} 
    />
    <Route 
        path="/checkout" 
        element={user ? <Checkout cart={cart} user={user} /> : <Navigate to="/" replace />} 
    />
    <Route 
        path="/orders" 
        element={<Orders user={user} /> } 
    />
</Routes>

            </main>
            <Footer />
        </div>
    );
}


// Main App component for the Router
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
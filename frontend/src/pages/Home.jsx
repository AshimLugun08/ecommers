import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; 

// Components
import HeroCarousel from '../components/HeroCarousel';
import BrandStory from '../components/BrandStory';
import CollectionSections from '../components/CollectionSections';
import ShopTheReels from '../components/ShopTheReels';
import ProductGrid from '../components/ProductGrid';
import CategoryGrid from '../components/CategoryGrid';
import Testimonials from '../components/Testimonials';

// Mock data (No longer needed if showing API data)
// import { featuredProducts } from '../data/mock'; // <-- Removed

const API_URL = 'http://localhost:5000/api/products';

const Home = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  const [luxuryProducts, setLuxuryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allProducts = await response.json();

        // 1. Sort the products by price in descending order (highest price first)
        const sorted = allProducts.sort((a, b) => b.price - a.price);

        // 2. Select the top 5 costliest products
        const top5 = sorted.slice(0, 5);
// console.log("Top 5 luxury products:", top5); // Debug log
        
        setLuxuryProducts(top5);
        setError(null);

      } catch (err) {
        console.error("Error fetching top products:", err);
        setError("Failed to load luxury products.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-gray-800" />
        <p className="ml-2 text-lg text-gray-800">Loading Home Content...</p>
      </div>
    );
  }
  
  // Display error message if fetching failed
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Content Load Error</h2>
        <p className="text-gray-700">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Please check the server connection ({API_URL}).</p>
      </div>
    );
  }

  return (
    <>
      <HeroCarousel />
      <BrandStory />
      <CollectionSections />
      <ShopTheReels />
      
      {/* The grid now correctly displays the luxury products */}
      <ProductGrid 
        products={luxuryProducts} 
        title="The Luxury Edit" // <--- Updated title to match the fetched data
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlist={wishlist}
      />
      
      <CategoryGrid />
      
      <Testimonials />
    </>
  );
};

export default Home;
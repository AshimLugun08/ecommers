import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// NOTE: ProductGrid component is not used here, replaced by inline rendering.
// import ProductGrid from '../components/ProductGrid'; 

// Removed: import { featuredProducts, categories } from '../data/mock';

// Define the API endpoint
const API_URL = 'http://localhost:5000/api/products';

// Define a placeholder for categories since we don't fetch them separately yet.
// In a real app, you would fetch these from an endpoint like /api/categories.
const MOCK_CATEGORIES = [
  { id: 1, name: 'Co-ord Sets' },
  { id: 2, name: 'Dresses' },
  { id: 3, name: 'Vests' },
  { id: 4, name: 'Collections' },
];

const Shop = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  // State for fetching and data
  const [allProducts, setAllProducts] = useState([]); // Stores all fetched products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // State for price range filter (added structure)
  const [priceRange, setPriceRange] = useState('all'); 
  
  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched products:", {data});
        setAllProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please check the backend connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Run only once on component mount


  // --- Filtering Logic ---
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if the product's category matches the selected filter
    const matchesCategory = selectedCategory === 'all' || 
                            (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
    
    // Simple Price Range Filter Logic (based on your template checkboxes)
    const matchesPrice = (() => {
      const price = product.price;
      switch (priceRange) {
        case 'under-5000': return price < 5000;
        case '5000-10000': return price >= 5000 && price <= 10000;
        case '10000-15000': return price > 10000 && price <= 15000;
        case 'above-15000': return price > 15000;
        default: return true; // 'all' range
      }
    })();
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // --- Sorting Logic ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        // Assuming products from API have a 'createdAt' field
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Helper function to handle price range checkbox changes
  const handlePriceRangeChange = (value) => {
    setPriceRange(value === priceRange ? 'all' : value); // Toggle logic
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-gray-800" />
        <p className="ml-2 text-lg text-gray-800">Loading Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-center py-20">
        <h2 className="text-xl text-red-600 font-semibold">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Shop All</h1>
          <p className="text-lg text-gray-600">Discover our complete collection of luxury fashion</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-lg mb-6">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter (Uses MOCK_CATEGORIES since API categories aren't implemented) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {MOCK_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.name.toLowerCase()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={priceRange === 'under-5000'} 
                      onChange={() => handlePriceRangeChange('under-5000')}
                    />
                    <span className="text-sm">Under ₹5,000</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={priceRange === '5000-10000'} 
                      onChange={() => handlePriceRangeChange('5000-10000')}
                    />
                    <span className="text-sm">₹5,000 - ₹10,000</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={priceRange === '10000-15000'} 
                      onChange={() => handlePriceRangeChange('10000-15000')}
                    />
                    <span className="text-sm">₹10,000 - ₹15,000</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={priceRange === 'above-15000'} 
                      onChange={() => handlePriceRangeChange('above-15000')}
                    />
                    <span className="text-sm">Above ₹15,000</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter size={20} className="mr-2" />
                  Filters
                </Button>
                <p className="text-gray-600">
                  Showing {sortedProducts.length} of {allProducts.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 
                'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 
                'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <Link to={`/product/${product._id}`} key={product._id}>
  <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="relative overflow-hidden aspect-[3/4]">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
        <Button
          onClick={(e) => {
            e.preventDefault(); // prevent link click when adding to cart
            onAddToCart(product);
          }}
          className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm font-medium"
        >
          Add to Cart
        </Button>
      </div>
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-500 mb-1">{product.category}</p>
      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
      <p className="text-lg font-semibold text-gray-800">Rs. {product.price.toLocaleString()}</p>
    </div>
  </div>
</Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
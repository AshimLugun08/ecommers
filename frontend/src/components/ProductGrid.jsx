import React from 'react';
import { Button } from './ui/button';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted = false }) => {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
          >
            <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
          <Button
            onClick={() => onAddToCart(product)}
            className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm font-medium"
          >
            <ShoppingBag size={16} className="mr-2" />
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
  );
};

const ProductGrid = ({ products, title, onAddToCart, onToggleWishlist, wishlist = [] }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
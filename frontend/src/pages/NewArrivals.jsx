import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { featuredProducts } from '../data/mock';

const NewArrivals = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  // Create new arrivals by modifying existing products
  const newArrivals = [
    {
      id: 501,
      name: 'Sunset Bloom Maxi Dress',
      price: 8900,
      image:
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
      category: 'Dresses',
      isNew: true,
    },
    {
      id: 502,
      name: 'Ocean Breeze Co-ord Set',
      price: 7600,
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
      category: 'Co-ord Sets',
      isNew: true,
    },
    {
      id: 503,
      name: 'Midnight Velvet Jumpsuit',
      price: 9800,
      image:
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&q=80',
      category: 'Jumpsuits',
      isNew: true,
    },
    {
      id: 504,
      name: 'Rose Gold Sequin Blazer',
      price: 11200,
      image:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80',
      category: 'Blazers',
      isNew: true,
    },
    {
      id: 505,
      name: 'Ethereal Chiffon Shirt',
      price: 5400,
      image:
        'https://images.unsplash.com/photo-1564557287817-3785e38ec2fe?w=600&q=80',
      category: 'Shirts',
      isNew: true,
    },
    {
      id: 506,
      name: 'Lavender Dreams Dress',
      price: 8200,
      image:
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
      category: 'Dresses',
      isNew: true,
    },
    {
      id: 507,
      name: 'Tropical Paradise Co-ord',
      price: 9100,
      image:
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
      category: 'Co-ord Sets',
      isNew: true,
    },
    {
      id: 508,
      name: 'Golden Hour Vest',
      price: 6800,
      image:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
      category: 'Vests',
      isNew: true,
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div
        className='relative h-[50vh] bg-cover bg-center'
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80)',
        }}
      >
        <div className='absolute inset-0 bg-black bg-opacity-40' />
        <div className='absolute inset-0 flex items-center justify-center text-white text-center'>
          <div>
            <h1 className='text-4xl md:text-6xl font-serif mb-4'>
              New Arrivals
            </h1>
            <p className='text-lg md:text-xl font-light'>
              Fresh styles for the modern muse
            </p>
          </div>
        </div>
      </div>

      {/* Collection Info */}
      <div className='bg-gradient-to-r from-purple-50 to-pink-50 py-16'>
        <div className='container mx-auto px-4 text-center max-w-3xl'>
          <h2 className='text-3xl font-serif text-gray-800 mb-6'>
            Spring Summer '25 Collection
          </h2>
          <p className='text-lg text-gray-600 leading-relaxed mb-8'>
            Embrace the season with our latest arrivals featuring vibrant
            colors, flowing silhouettes, and artisanal details. Each piece is
            thoughtfully designed to celebrate your unique style.
          </p>
          <div className='flex flex-wrap justify-center gap-4 text-sm text-gray-500'>
            <span className='bg-white px-4 py-2 rounded-full'>
              ✨ Limited Edition
            </span>
            <span className='bg-white px-4 py-2 rounded-full'>
              🌸 Spring Collection
            </span>
            <span className='bg-white px-4 py-2 rounded-full'>
              🎨 Artisan Crafted
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className='group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
              >
                {/* New Badge */}
                {product.isNew && (
                  <div className='absolute top-4 left-4 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full z-10'>
                    NEW
                  </div>
                )}

                <div className='relative overflow-hidden aspect-[3/4]'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all' />
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all'>
                    <button
                      onClick={() => onAddToCart(product)}
                      className='bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm font-medium rounded transition-colors'
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className='p-4'>
                  <p className='text-xs text-gray-500 mb-1'>
                    {product.category}
                  </p>
                  <h3 className='font-medium text-gray-800 mb-2 line-clamp-2'>
                    {product.name}
                  </h3>
                  <p className='text-lg font-semibold text-gray-800'>
                    Rs. {product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;

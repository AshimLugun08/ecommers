import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { influencerProducts } from '../data/mock';

const InfluencerPicks = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  const influencerSpotlight = [
    {
      id: 1,
      name: 'Tanya Sharma Bajaj',
      handle: '@tanyasharmabajaj',
      followers: '125K',
      bio: 'Fashion enthusiast & lifestyle blogger',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      products: [1, 2],
    },
    {
      id: 2,
      name: 'Kushnaz Turner',
      handle: '@kushnazturner',
      followers: '89K',
      bio: 'Style curator & fashion photographer',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      products: [2, 3],
    },
    {
      id: 3,
      name: 'Sania Chadha',
      handle: '@saniachadha',
      followers: '76K',
      bio: 'Sustainable fashion advocate',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      products: [3, 4],
    },
    {
      id: 4,
      name: 'Prerna Mehra',
      handle: '@prernamehra',
      followers: '156K',
      bio: 'Luxury fashion connoisseur',
      image:
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
      products: [4, 1],
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-serif mb-6'>
            Influencer Picks
          </h1>
          <p className='text-lg md:text-xl font-light max-w-2xl mx-auto'>
            Discover curated styles from fashion influencers who inspire
            millions
          </p>
        </div>
      </div>

      {/* As Seen On Section */}
      <div className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-serif text-gray-800 mb-4'>
              As Seen On
            </h2>
            <p className='text-gray-600'>
              These pieces have been loved and styled by our influencer
              community
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {influencerProducts.map((product) => (
              <div
                key={product.id}
                className='group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
              >
                <div className='relative overflow-hidden aspect-[3/4]'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full'>
                    ✨ Influencer Pick
                  </div>
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all' />
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all'>
                    <Button
                      onClick={() => onAddToCart(product)}
                      className='bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 text-sm font-medium'
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className='p-4'>
                  <p className='text-xs text-purple-600 mb-1'>
                    Styled by {product.influencer}
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

      {/* CTA Section */}
      <div className='bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-serif mb-4'>Want to be Featured?</h2>
          <p className='text-lg mb-8 max-w-2xl mx-auto'>
            Tag us in your <span className='font-bold'>iraxa fashion</span>{' '}
            looks for a chance to be featured on our website and social media!
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a
              href='https://www.instagram.com/iraxa_fashion/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center border border-white text-white hover:bg-white hover:text-purple-600 px-4 py-2 rounded-lg font-semibold transition-colors'
            >
              <Instagram size={20} className='mr-2' />
              iraxa fashion
            </a>
            <Button
              variant='outline'
              className='border-white text-white hover:bg-white hover:text-purple-600'
            >
              Collaboration Inquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerPicks;

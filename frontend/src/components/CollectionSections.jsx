import React from 'react';
import { Button } from './ui/button';

const CollectionSections = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Influencer Look */}
          <div className="relative h-96 overflow-hidden rounded-2xl group">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 bg-opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8">
                <h3 className="text-sm font-medium tracking-wider mb-2">INFLUENCER LOOK</h3>
                <h2 className="text-3xl font-serif italic mb-6">Influencer Look</h2>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-800 px-6 py-2"
                >
                  VIEW ALL
                </Button>
              </div>
            </div>
          </div>

          {/* Spring Summer */}
          <div className="relative h-96 overflow-hidden rounded-2xl group">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 bg-opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8">
                <h3 className="text-sm font-medium tracking-wider mb-2">SPRING SUMMER'25</h3>
                <h2 className="text-3xl font-serif italic mb-6">La Tropique</h2>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-800 px-6 py-2"
                >
                  NEW ARRIVALS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionSections;
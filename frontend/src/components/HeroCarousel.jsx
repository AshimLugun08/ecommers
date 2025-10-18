import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { collections } from '../data/mock';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % collections.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % collections.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + collections.length) % collections.length);
  };

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {collections.map((collection, index) => (
        <div
          key={collection.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${collection.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute inset-0 flex items-center justify-end pr-12 md:pr-24">
              <div className="text-right text-white">
                <h2 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
                  {collection.name.split(' ').map((word, idx) => (
                    <div key={idx} className={idx === 1 ? 'font-light italic' : ''}>
                      {word}
                    </div>
                  ))}
                </h2>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-sm font-medium tracking-wider"
                >
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
      >
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {collections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
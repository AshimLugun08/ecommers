import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/mock';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialsToShow, setTestimonialsToShow] = useState(3);

  useEffect(() => {
    const updateTestimonialsToShow = () => {
      if (window.innerWidth < 768) {
        setTestimonialsToShow(1);
      } else if (window.innerWidth < 1024) {
        setTestimonialsToShow(2);
      } else {
        setTestimonialsToShow(3);
      }
    };

    updateTestimonialsToShow();
    window.addEventListener('resize', updateTestimonialsToShow);
    return () => window.removeEventListener('resize', updateTestimonialsToShow);
  }, []);

  const nextTestimonials = () => {
    setCurrentIndex((prev) => {
      const maxIndex = testimonials.length - testimonialsToShow;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevTestimonials = () => {
    setCurrentIndex((prev) => {
      const maxIndex = testimonials.length - testimonialsToShow;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gray-800 mb-4">
            Don't take our word for it — hear it from our customers
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / testimonialsToShow)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className={`flex-shrink-0 px-4`}
                  style={{ width: `${100 / testimonialsToShow}%` }}
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote size={20} className="text-purple-300 mb-2" />
                      <p className="text-gray-600 text-sm leading-relaxed">{testimonial.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonials}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={nextTestimonials}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: testimonials.length - testimonialsToShow + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
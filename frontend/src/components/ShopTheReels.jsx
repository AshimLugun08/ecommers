import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from './ui/button';
import { reelsData } from '../data/mock';

const ShopTheReels = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-gray-800 mb-4">SHOP THE REELS</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {reelsData.map((reel) => (
            <div key={reel.id} className="relative group cursor-pointer" onClick={() => setSelectedVideo(reel)}>
              <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play size={24} className="text-gray-800 ml-1" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-center mt-2 text-gray-700">{reel.title}</p>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-medium">{selectedVideo.title}</h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={selectedVideo.video}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopTheReels;
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GalleryGrid({ images, videos }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && selectedMedia) {
        setSelectedMedia(null);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscKey);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedMedia]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMedia]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images && images.map((image, index) => (
          <div
            key={`img-${index}`}
            className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
            onClick={() => setSelectedMedia({ type: 'image', data: image })}
          >
            <Image
              src={image.url}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold">🔍 Click to view</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing full image */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          {/* Close Button (X) - Top Right */}
          <button
            className="absolute top-4 right-4 text-white text-5xl hover:text-[#84CC16] z-50 transition-all transform hover:scale-125 hover:rotate-90 duration-300 font-bold"
            onClick={() => setSelectedMedia(null)}
            title="Close (Esc)"
          >
            ×
          </button>

          {/* ESC Button - Top Left */}
          <button
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full z-50 transition-all duration-300 font-bold text-lg flex items-center space-x-2 hover:scale-110"
            onClick={() => setSelectedMedia(null)}
          >
            <span>⌨️</span>
            <span>Press ESC to close</span>
          </button>

          {/* Image Counter */}
          {images && images.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full z-50 font-bold text-lg">
              {images.findIndex(img => img.url === selectedMedia.data.url) + 1} / {images.length}
            </div>
          )}

          {/* Close hint at bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full z-50 font-semibold text-sm animate-pulse">
            Click anywhere or press ESC to close
          </div>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' && (
              <div className="relative w-full h-[80vh]">
                <Image
                  src={selectedMedia.data.url}
                  alt="Gallery image"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

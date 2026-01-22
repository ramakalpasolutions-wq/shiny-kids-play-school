'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [heroImages, setHeroImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHeroImages = async () => {
    try {
      const res = await fetch('/api/hero');
      const data = await res.json();
      console.log('Fetched hero data:', data);
      
      if (data.images && data.images.length > 0) {
        setHeroImages(data.images);
        console.log('Hero images set:', data.images);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Default if no images
  if (heroImages.length === 0) {
    return (
      <div className="relative h-[500px] bg-gradient-to-r from-[#14B8A6] to-[#84CC16] flex items-center justify-center overflow-hidden">
        <div 
          className="text-center text-white px-4"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to Shiny Kids Play School ✨
          </h1>
          <p className="text-2xl md:text-3xl drop-shadow">Where Learning Meets Fun! 🎈</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Image Section with Parallax */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Blurred Background Image with Parallax */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                transform: `translateY(${scrollY * 0.3}px) scale(1.2)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <Image
                src={image.url}
                alt="Background blur"
                fill
                sizes="100vw"
                className="object-cover blur-3xl"
                priority={index === 0}
                quality={50}
              />
              {/* Dark overlay on blur */}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Sharp Image on Top with Parallax */}
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center px-4 md:px-8"
              style={{ 
                transform: `translateY(${scrollY * 0.5}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="relative w-full h-full max-w-6xl">
                <Image
                  src={image.url}
                  alt="Hero"
                  fill
                  sizes="100vw"
                  className="object-contain rounded-3xl"
                  priority={index === 0}
                  quality={100}
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Navigation dots */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 h-4 bg-[#84CC16] rounded-full' 
                    : 'w-4 h-4 bg-white/60 rounded-full hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center z-30 transition text-2xl font-bold backdrop-blur-sm"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % heroImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center z-30 transition text-2xl font-bold backdrop-blur-sm"
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Text Section Below Image with Parallax */}
      <div 
        className="bg-gradient-to-r from-[#14B8A6] to-[#84CC16] py-12 md:py-16 overflow-hidden"
        style={{ 
          transform: `translateY(${scrollY * -0.2}px)`,
          transition: 'transform 0.5s ease-out'
        }}
      >
        <div className="text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
            Welcome to Shiny Kids Play School ✨
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl drop-shadow">
            Where Learning Meets Fun! 🎈
          </p>
        </div>
      </div>
    </div>
  );
}

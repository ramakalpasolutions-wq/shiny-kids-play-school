'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#14B8A6] shadow-2xl py-3' 
          : 'bg-[#14B8A6] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <span className="text-4xl group-hover:animate-bounce transition-all">✨</span>
            <span className="text-white text-2xl font-bold group-hover:text-[#84CC16] transition-colors">
              Shiny Kids
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2">
            {[
              { name: 'Home', href: '/', icon: '🏠' },
              { name: 'About', href: '/about', icon: '📖' },
              { name: 'Programs', href: '/programs', icon: '🎓' },
              { name: 'Gallery', href: '/gallery', icon: '📸' },
              { name: 'Contact', href: '/contact', icon: '📞' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white px-6 py-2 rounded-full hover:bg-[#84CC16] transition-all duration-300 font-semibold hover:scale-110 transform flex items-center space-x-2 group"
              >
                <span className="group-hover:animate-bounce">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-3xl hover:text-[#84CC16] transition-colors"
          >
            {isMobileMenuOpen ? '✖️' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 animate-fade-in-up">
            {[
              { name: 'Home', href: '/', icon: '🏠' },
              { name: 'About', href: '/about', icon: '📖' },
              { name: 'Programs', href: '/programs', icon: '🎓' },
              { name: 'Gallery', href: '/gallery', icon: '📸' },
              { name: 'Contact', href: '/contact', icon: '📞' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white px-4 py-3 rounded-2xl hover:bg-[#84CC16] transition-all font-semibold flex items-center space-x-3"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

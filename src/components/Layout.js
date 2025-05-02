import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from './Footer';
import { getAllGalleryFolders } from '../lib/contentful';

export default function Layout({ children, minimal = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const router = useRouter();

  // Check if route is active
  const isActive = (path) => router.pathname === path;
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [router.pathname]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch gallery folders for navigation
  useEffect(() => {
    async function fetchGalleries() {
      try {
        const galleryFolders = await getAllGalleryFolders();
        setGalleries(galleryFolders || []);
      } catch (error) {
        console.error('Error fetching galleries for navigation:', error);
      }
    }
    
    fetchGalleries();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation - Minimal version for homepage, normal for other pages */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        minimal 
          ? 'bg-transparent pt-4' 
          : isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/" className={`text-2xl ${minimal ? 'font-light' : 'font-bold'}`}>
              <span className={`${
                minimal ? 'text-white' : isScrolled ? 'text-gray-900' : 'text-white'
              } transition-colors`}>
                Portfolio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className={`${
                  isActive('/') 
                    ? minimal 
                      ? 'text-white font-medium'
                      : 'border-b-2 border-gray-800' 
                    : 'hover:text-gray-300'
                } ${
                  minimal 
                    ? 'text-white/80' 
                    : isScrolled 
                      ? 'text-gray-800' 
                      : 'text-white'
                } transition-colors`}
              >
                Home
              </Link>
              
              {/* Galleries Dropdown */}
              <div className="relative group">
                <button className={`flex items-center ${
                  router.pathname.startsWith('/gallery') 
                    ? minimal 
                      ? 'text-white font-medium'
                      : 'border-b-2 border-gray-800' 
                    : 'hover:text-gray-300'
                } ${
                  minimal 
                    ? 'text-white/80' 
                    : isScrolled 
                      ? 'text-gray-800' 
                      : 'text-white'
                } transition-colors`}>
                  Galleries
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="absolute left-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {galleries.length > 0 ? (
                    galleries.map((gallery) => (
                      <Link
                        key={gallery.sys.id}
                        href={`/gallery/${gallery.fields.slug}`}
                        className="block px-4 py-2 text-white/90 hover:text-white hover:bg-black/50"
                      >
                        {gallery.fields.title}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-white/50">No galleries found</span>
                  )}
                </div>
              </div>
              
              <Link 
                href="/about" 
                className={`${
                  isActive('/about') 
                    ? minimal 
                      ? 'text-white font-medium'
                      : 'border-b-2 border-gray-800' 
                    : 'hover:text-gray-300'
                } ${
                  minimal 
                    ? 'text-white/80' 
                    : isScrolled 
                      ? 'text-gray-800' 
                      : 'text-white'
                } transition-colors`}
              >
                About
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${
                  minimal 
                    ? 'text-white' 
                    : isScrolled 
                      ? 'text-gray-800' 
                      : 'text-white'
                }`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 md:hidden pt-16">
          <nav className="flex flex-col p-6">
            <Link 
              href="/"
              className={`py-4 text-xl border-b border-white/20 text-white ${isActive('/') ? 'font-medium' : ''}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            
            <div className="py-4 border-b border-white/20">
              <h3 className="text-xl mb-3 text-white">Galleries</h3>
              <div className="pl-2 flex flex-col space-y-3">
                {galleries.length > 0 ? (
                  galleries.map((gallery) => (
                    <Link
                      key={gallery.sys.id}
                      href={`/gallery/${gallery.fields.slug}`}
                      className="py-1 text-white/90 hover:text-white"
                      onClick={toggleMenu}
                    >
                      {gallery.fields.title}
                    </Link>
                  ))
                ) : (
                  <span className="py-2 text-white/50">No galleries found</span>
                )}
              </div>
            </div>
            
            <Link 
              href="/about"
              className={`py-4 text-xl border-b border-white/20 text-white ${isActive('/about') ? 'font-medium' : ''}`}
              onClick={toggleMenu}
            >
              About
            </Link>
            
            {/* Close button */}
            <button 
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-white"
              aria-label="Close menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Main content - No top padding for minimal mode (homepage) */}
      <div className={`flex-grow ${minimal ? '' : 'pt-16'}`}>
        {children}
      </div>

      {/* Footer - Only show on non-minimal pages */}
      {!minimal && <Footer />}
    </div>
  );
}
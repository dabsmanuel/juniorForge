'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Check if current page should have glassmorphic effect
  const glassmorphicPages = ['/talents', '/startups', '/contact'];
  const isGlassmorphic = glassmorphicPages.includes(pathname);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide when scrolling down, show when scrolling up (but not on mobile when menu is open)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        if (!isMenuOpen) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Desktop capsule styles based on current page
  const desktopCapsuleClass = isGlassmorphic 
    ? "bg-white/10 backdrop-blur-md border border-[#12895E]" 
    : "bg-[#16252D] border border-gray-100/10";

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'To Startups', href: '/startups' },
    { name: 'To Talents', href: '/talents' },
  ];

  // Function to check if a nav item is active
  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href;
  };

  return (
    <>
      <nav className={`w-full fixed top-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
        {/* Desktop Capsule Container */}
        <div className="hidden md:block pt-4 px-4">
          <div className={`max-w-6xl mx-auto ${desktopCapsuleClass} rounded-full shadow-lg`}>
            <div className="flex justify-between items-center h-16 lg:h-18 px-6 lg:px-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image 
                    src={isGlassmorphic ? "/images/juniorforge.png" : "/images/juniorforge.png"}
                    alt="Logo" 
                    width={100} 
                    height={100}
                    className="h-auto w-auto"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="flex items-center space-x-1 lg:space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 lg:px-4 py-2 rounded-full transition-all duration-200 ease-in-out font-medium text-sm lg:text-base ${
                      isGlassmorphic 
                        ? 'hover:bg-black/10 hover:backdrop-blur-sm text-white' 
                        : 'hover:bg-gray-700 text-white'
                    } ${
                      isActive(item.href) 
                        ? `after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-0.5 after:rounded-full ${
                            isGlassmorphic ? 'after:bg-black' : 'after:bg-white'
                          }` 
                        : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Desktop Contact Button */}
              <div>
                <Link
                  href="/contact"
                  className={`${
                    isActive('/contact') 
                      ? 'bg-[#0F6B47] border-[#37ffb7]' 
                      : 'bg-[#12895E] border-[#37ffb7] hover:bg-[#0F6B47]'
                  } text-white border px-6 lg:px-8 py-2 lg:py-3 rounded-full transition-all duration-300 ease-in-out font-medium text-sm lg:text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5`}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden w-full bg-[#16252D] shadow-sm border-b border-gray-100/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image 
                    src="/images/juniorforge.png" 
                    alt="Logo" 
                    width={100} 
                    height={100}
                    className="h-auto w-auto"
                    priority
                  />
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-0' : 'mb-1'
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : 'mb-1'
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 -translate-y-0' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu - Full Screen Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[9999] md:hidden px-4">
          {/* Close button */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-3 text-white bg-[#16252D] rounded-full transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex items-center justify-center h-[80vh] px-6    mt-4">
            <div className="w-full max-w-md">
              {/* Navigation Links */}
              <div className="space-y-4 mb-8 bg-[#16252D] py-10 rounded-lg">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-6 py-4 text-white font-medium text-2xl text-center rounded-xl transition-all duration-200 hover:bg-gray-700/30 ${
                      isActive(item.href) 
                        ? 'bg-gray-700/50 text-[#12895E]' 
                        : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Contact Button */}
                <Link 
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-center font-medium text-2xl px-8 py-4 rounded-full transition-all duration-300 shadow-lg ${
                    isActive('/contact') 
                      ? 'bg-[#0F6B47] text-white' 
                      : 'bg-[#12895E] text-white hover:bg-[#0F6B47]'
                  }`}
                >
                  Contact
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Ensure mobile menu items are always visible when menu is open */
        .mobile-menu-open {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999 !important;
          background-color: #16252D !important;
        }

        /* Force visibility for small screens */
        @media (max-width: 640px) {
          .mobile-menu-item {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 10000 !important;
          }
        }
      `}</style>
    </>
  );
}
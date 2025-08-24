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
  const glassmorphicPages = ['/talents', '/startups', '/contact', '/about'];
  const isGlassmorphic = glassmorphicPages.includes(pathname);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    <nav className={`w-full sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
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
                  src={isGlassmorphic ? "/images/greenlogo.png" : "/images/juniorforge.png"}
                  alt="Logo" 
                  width={100} 
                  height={100}
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
                      ? 'hover:bg-black/10 hover:backdrop-blur-sm text-black' 
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
                    : 'bg-[#12895E] border-[#37ffb7]'
                } text-white border px-6 lg:px-8 py-2 lg:py-3 rounded-full hover:bg-gray-900 transition-all duration-300 ease-in-out font-medium text-sm lg:text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5`}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden w-full bg-[#16252D] shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-0 lg:px-0">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image src="/images/juniorforge.png" alt="Logo" width={100} height={100} />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-white transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Full Screen Overlay */}
        <div
          className={`fixed inset-0 top-16 lg:top-20 bg-[#16252D] z-40 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="h-full overflow-y-auto px-4 py-6">
            <div className="space-y-2 text-center">
              {navItems.map((item, index) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative block px-4 py-4 text-white  transition-all duration-200 font-medium text-lg  ${
                    isMenuOpen
                      ? `animate-fadeInUp animation-delay-${index * 100}`
                      : ''
                  } ${
                    isActive(item.href) ? 'after:absolute after:bottom-3 after:left-4 after:right-4 after:h-0.5 after:bg-white after:rounded-full' : ''
                  }`}
                  style={{
                    animationDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Contact Button */}
              <div className="pt-8">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-center ${
                    isActive('/contact') 
                      ? 'bg-[#12895E] text-white' 
                      : 'bg-[#12895E] text-white hover:bg-gray-100'
                  } px-6 py-4 rounded-full transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isMenuOpen ? 'animate-fadeInUp animation-delay-400' : ''
                  }`}
                  style={{
                    animationDelay: isMenuOpen ? '400ms' : '0ms'
                  }}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </nav>
  );
}
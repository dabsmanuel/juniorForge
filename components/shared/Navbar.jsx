'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
    ? "bg-black/5 backdrop-blur-md border border-[#37ffb7]" 
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

  // Mobile menu animation variants
  const menuOverlayVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      y: 10
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const closeButtonVariants = {
    hidden: {
      opacity: 0,
      rotate: -90,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.nav 
        className={`w-full fixed top-0 z-50`}
        initial={{ y: 0 }}
        animate={{ 
          y: isVisible ? 0 : '-100%',
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
      >
        {/* Desktop Capsule Container */}
        <div className="hidden md:block pt-3 lg:pt-4 px-3 lg:px-4">
          <motion.div 
            className={`max-w-6xl mx-auto ${desktopCapsuleClass} rounded-full shadow-lg`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center h-14 lg:h-16 xl:h-18 px-4 lg:px-6 xl:px-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image 
                    src={isGlassmorphic ? "/images/juniorforge.png" : "/images/juniorforge.png"}
                    alt="Logo" 
                    width={180} 
                    height={180}
                    className="h-auto w-auto max-w-[140px] lg:max-w-[160px] xl:max-w-[180px]"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 rounded-full transition-all duration-200 ease-in-out font-medium text-xs lg:text-sm xl:text-base ${
                      isGlassmorphic 
                        ? 'hover:bg-black/40 hover:backdrop-blur-sm text-white' 
                        : 'hover:bg-gray-700 text-white'
                    } ${
                      isActive(item.href) 
                        ? `after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 lg:after:w-14 xl:after:w-16 after:h-0.5 after:rounded-full ${
                            isGlassmorphic ? 'after:bg-white' : 'after:bg-white'
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
                  } text-white border px-4 lg:px-6 xl:px-8 py-1.5 lg:py-2 xl:py-3 rounded-full transition-all duration-300 ease-in-out font-medium text-xs lg:text-sm xl:text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5`}
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden w-full bg-[#16252D] shadow-sm border-b border-gray-100/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image 
                    src="/images/juniorforge.png" 
                    alt="Logo" 
                    width={120} 
                    height={120}
                    className="h-auto w-auto max-w-[100px] sm:max-w-[120px]"
                    priority
                  />
                </Link>
              </div>

              {/* Mobile menu button */}
              <motion.button
                onClick={toggleMenu}
                className="p-2 sm:p-3 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                  <motion.span
                    className="block w-4 sm:w-5 h-0.5 bg-current mb-1"
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      y: isMenuOpen ? 6 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block w-4 sm:w-5 h-0.5 bg-current mb-1"
                    animate={{
                      opacity: isMenuOpen ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block w-4 sm:w-5 h-0.5 bg-current"
                    animate={{
                      rotate: isMenuOpen ? -45 : 0,
                      y: isMenuOpen ? -6 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu - Full Screen Overlay with Animation */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white z-[9999] md:hidden"
            variants={menuOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
              <motion.button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 sm:p-3 text-white bg-[#16252D] rounded-full transition-colors hover:bg-[#1a2d36]"
                aria-label="Close menu"
                variants={closeButtonVariants}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Menu Content */}
            <div className="flex items-center justify-center min-h-screen px-4 sm:px-6">
              <div className="w-full max-w-sm sm:max-w-md">
                {/* Navigation Links */}
                <motion.div 
                  className="space-y-3 sm:space-y-4 bg-[#16252D] py-16 sm:py-10 lg:py-32 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-2xl"
                  variants={menuOverlayVariants}
                >
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      variants={menuItemVariants}
                    >
                      <Link 
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 sm:px-6 py-3 sm:py-4 text-white font-medium text-xl sm:text-2xl text-center rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-gray-700/30 ${
                          isActive(item.href) 
                            ? 'bg-gray-700/50 text-[#37ffb7]' 
                            : ''
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Contact Button */}
                  <motion.div
                    variants={menuItemVariants}
                    className="pt-2 sm:pt-4"
                  >
                    <Link 
                      href="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full text-center font-medium text-xl sm:text-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 ${
                        isActive('/contact') 
                          ? 'bg-[#0F6B47] text-white' 
                          : 'bg-[#12895E] text-white hover:bg-[#0F6B47]'
                      }`}
                    >
                      Contact
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Background overlay animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
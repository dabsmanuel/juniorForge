import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-fixed">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 startup"
        style={{
          backgroundImage: `url('/images/talent.png')`
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/35 z-10" />
      
      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl lg:px-16 lg:text-start text-center tracking-tighter">
            {/* Heading */}
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <h2>Real World</h2>
              <h2>Experience Awaits You</h2>
            </div>
            
            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 leading-tight">
              See current internship and entry-level positions from vetted startups.
            </p>
            
            {/* CTA Button */}
            <Link href='/contact' className="inline-flex items-center px-32 py-4 bg-[#12895E] hover:bg-[#0f7a4b] text-white font-semibold text-lg rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl border border-[#37ffb7]">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
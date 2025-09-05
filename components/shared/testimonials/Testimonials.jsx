'use client'
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '@/data/db'
import { ImQuotesLeft } from "react-icons/im";
import Image from 'next/image';
import { motion } from "framer-motion"

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 4000) 
    return () => clearInterval(interval)
  }, [])

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  }

  return (
    <div className='w-full max-w-none md:max-w-6xl lg:rounded-e-[56px] bg-[#12895E] px-4 sm:px-6 md:px-8 py-4 lg:mt-16'>
      <div className='w-full max-w-none md:max-w-5xl mx-auto mb-6 md:mb-10'>
        <motion.h2 
          className='text-white font-bold text-2xl sm:text-3xl md:text-4xl md:block hidden pt-8 md:pt-12 pb-12 md:pb-24 text-center md:text-left'
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          Trusted by Amazing Individuals
        </motion.h2>
        
        {/* Mobile title - show on small screens */}
        <motion.h2 
          className='md:hidden text-white font-bold text-xl sm:text-2xl pt-4 pb-6 text-center'
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          Trusted by Amazing Individuals
        </motion.h2>
        
        {/* Image for small screens - positioned above testimonial */}
        <div className='md:hidden w-full h-40 sm:h-48 relative overflow-hidden mt-4 rounded-t-3xl'>
          <Image 
            src="/images/testimonial.png" 
            alt="Testimonial Background" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className='h-full md:rounded-4xl md:py-8 flex md:items-center md:justify-center md:relative'>

          {/* Image for large screens - original positioning */}
          <div className='md:block hidden absolute inset-0'>
            <Image 
              src="/images/testimonial.png" 
              alt="Testimonial Background" 
              fill
              className='lg:rounded-4xl object-cover'
            />
          </div>
          
          <div 
            className='bg-white md:rounded-4xl rounded-b-3xl md:rounded-t-3xl relative md:-right-32 lg:-right-64 md:-top-8 lg:-top-18 xl:-right-64 xl:-top-18 p-4 sm:p-5 md:p-6 w-full max-w-full sm:max-w-md md:max-w-sm lg:max-w-md xl:max-w-lg overflow-hidden mx-auto md:mx-0 z-10'
          >

            <div className='flex justify-center relative -top-6 sm:-top-8 md:-top-10 -left-8 sm:-left-12 md:-left-16 transform overflow-hidden'>
              <ImQuotesLeft className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-gray-900' />
            </div>
            
            {/* Pagination buttons - only show on large screens inside the card */}
            <div className='md:flex hidden justify-end gap-2 lg:gap-4 items-center mb-2 lg:mb-4 relative -top-12 sm:-top-16 md:-top-20'>
              <button 
                onClick={prevTestimonial}
                className='p-1.5 lg:p-2 rounded-full border-2 border-[#1f1f1f] hover:bg-gray-50 transition-colors'
                aria-label="Previous testimonial"
              >
                <ChevronLeft className='w-4 h-4 lg:w-5 lg:h-5 text-[#1f1f1f]' />
              </button>
              <button 
                onClick={nextTestimonial}
                className='p-1.5 lg:p-2 rounded-full border-2 border-[#1f1f1f] hover:bg-gray-50 transition-colors'
                aria-label="Next testimonial"
              >
                <ChevronRight className='w-4 h-4 lg:w-5 lg:h-5 text-[#1f1f1f]' />
              </button>
            </div>

            <div className='text-center overflow-hidden relative py-2 mt-0 sm:mt-1 md:mt-0'>
              <div 
                className='flex transition-transform duration-500 ease-in-out'
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className='w-full flex-shrink-0 px-3 sm:px-4 md:px-2'>
                    <p className='text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed break-words hyphens-auto'>
                      {testimonial.text}
                    </p>
                    
                    {/* User Info */}
                    <div className='flex items-center justify-center gap-3 sm:gap-4 md:gap-3'>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-11 md:h-11 rounded-full ${testimonial.avatar} border-2 border-[#1f1f1f] flex items-center justify-center flex-shrink-0`}>
                        <span className='text-gray-600 font-medium text-sm sm:text-base md:text-sm'>
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className='text-left min-w-0 flex-1'>
                        <h4 className='font-semibold text-gray-900 text-sm sm:text-base md:text-sm break-words'>
                          {testimonial.name}
                        </h4>
                        <p className='text-xs sm:text-sm md:text-xs text-gray-600 break-words'>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        
        </div>
        
        {/* Pagination dots - only show on small screens outside the card */}
        <div className='md:hidden flex justify-center gap-2 items-center mt-4 sm:mt-6 pb-4'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                index === currentTestimonial 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonials;
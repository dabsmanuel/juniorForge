'use client'
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '@/data/db'
import { ImQuotesLeft } from "react-icons/im";
import Image from 'next/image';

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

  return (
    <div className='lg:max-w-6xl lg:rounded-e-[56px] bg-[#12895E] px-8 py-4 lg:mt-16'>
      <div className='lg:max-w-5xl mx-auto mb-10'>
        <h2 className='text-white font-bold text-4xl lg:block hidden py-8'>
          Trusted by Amazing Individuals
        </h2>
        
        {/* Image for small screens - positioned above testimonial */}
        <div className='lg:hidden w-full h-53 relative overflow-hidden mt-4 rounded-t-3xl'>
          <Image 
            src="/images/testimonial.png" 
            alt="Testimonial Background" 
            layout="fill" 
            objectFit="cover" 
          />
        </div>
        
        <div 
          className='h-full lg:rounded-4xl  lg:py-8 flex lg:items-center lg:justify-center lg:relative'
        >

          {/* Image for large screens - original positioning */}
          <div className='lg:block hidden'>
            <Image 
              src="/images/testimonial.png" 
              alt="Testimonial Background" 
              layout="fill" 
              objectFit="cover" 
              className='lg:rounded-4xl' 
            />
          </div>
          
          <div className='bg-white lg:rounded-4xl rounded-b-3xl relative lg:-right-64 lg:-top-18 p-2 w-fit overflow-hidden max-w-sm'>

            <div className='flex justify-center relative -top-12 -left-20 right-0 transform -translate-x-2 overflow-hidden'>
              <ImQuotesLeft className='w-32 h-32 text-gray-900' />
            </div>
            
            {/* Pagination buttons - only show on large screens inside the card */}
            <div className='lg:flex hidden justify-end gap-4 items-center mb-4 relative -top-24'>
              <button 
                onClick={prevTestimonial}
                className='p-2 rounded-full border-2 border-[#1f1f1f] hover:bg-gray-50 transition-colors'
                aria-label="Previous testimonial"
              >
                <ChevronLeft className='w-5 h-5 text-[#1f1f1f]' />
              </button>
              <button 
                onClick={nextTestimonial}
                className='p-2 rounded-full border-2 border-[#1f1f1f] hover:bg-gray-50 transition-colors'
                aria-label="Next testimonial"
              >
                <ChevronRight className='w-5 h-5 text-[#1f1f1f]' />
              </button>
            </div>

            <div className='text-center overflow-hidden relative py-2 lg:mt-0 mt-4'>
              <div 
                className='flex transition-transform duration-500 ease-in-out'
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className='w-full flex-shrink-0 px-2'>
                    <p className='text-gray-700 text-lg mb-6 leading-relaxed'>
                      {testimonial.text}
                    </p>
                    
                    {/* User Info */}
                    <div className='flex items-center justify-center gap-4'>
                      <div className={`w-12 h-12 rounded-full ${testimonial.avatar} border-2 border-[#1f1f1f] flex items-center justify-center`}>
                        <span className='text-gray-600 font-medium text-lg'>
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className='text-left'>
                        <h4 className='font-semibold text-gray-900'>
                          {testimonial.name}
                        </h4>
                        <p className='text-sm text-gray-600'>
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
        <div className='lg:hidden flex justify-center gap-2 items-center mt-6'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
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
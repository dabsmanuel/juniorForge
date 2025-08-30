import React from 'react';
import Link from 'next/link';

const HowItWorks = () => {
  return (
    <section className="mb-16 bg-cover bg-center bg-no-repeat bg-[url('/images/rectangle.png')] py-12 text-white">
      <div className='max-w-6xl mx-auto lg:px-6 px-4 leading-tight py-32 lg:mt-0 mt-12 lg:block hidden'>
        <h2 className='lg:text-[48px] text-[32px] font-bold tracking-tighter lg:text-start text-center lg:relative lg:-top-12'>How it works</h2>
        <div className='flex lg:flex-row flex-col lg:space-y-0 space-y-8 justify-between mt-6'>
          <div className=''>
            <h2 className='lg:text-[48px] text-[32px] font-bold text-center'>1</h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Apply Once</li>
            </ul>
          </div>
          <div>
            <h2 className='lg:text-[48px] text-[32px] font-bold text-center'>3</h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Get Matched</li>
            </ul>
          </div>
        </div>
        <div className='text-center mt-6'>
          <h2 className='lg:text-[48px] text-[32px] font-bold'>2</h2>
          <ul>
            <li className='lg:text-2xl font-bold list-disc list-inside'>Get Vetted</li>
          </ul>
        </div>
      </div>

      {/* mobile view */}
      <div className='max-w-6xl mx-auto lg:px-6 px-4 leading-tight py-32 lg:mt-0 mt-12 lg:hidden block'>
        <h2 className='lg:text-[48px] text-[32px] font-bold tracking-tighter lg:text-start text-center lg:relative lg:-top-12'>How it works</h2>
        <div className='flex lg:flex-row flex-col lg:space-y-0 space-y-8 justify-between mt-6'>
          <div className=''>
            <h2 className='lg:text-[48px] text-[32px] font-bold text-center mb-2'>1</h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Apply Once</li>
            </ul>
          </div>
          <div className=''>
            <h2 className='lg:text-[48px] text-[32px] font-bold text-center mb-2'>2</h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Get Vetted</li>
            </ul>
          </div>
          <div>
            <h2 className='lg:text-[48px] text-[32px] font-bold text-center mb-2'>3</h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Get Matched</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
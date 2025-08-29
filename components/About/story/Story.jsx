import React from 'react'

const Story = () => {
  return (
    <div className='max-w-5xl mx-auto px-4 lg:px-0'>
      <div className="lg:flex hidden flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className='mt-14 px-6 flex-1'>
          <div className='mb-6'>
            <h2 className='text-4xl md:text-6xl font-bold'>Our Story:</h2>
            <h2 className='text-4xl md:text-6xl font-bold'>Where it all started from</h2>
          </div>
          <div className='mt-6'>
            <p className='p-6 bg-[#685EFC] rounded-2xl text-white text-lg md:text-xl'>
              At JuniorForge, we believe startups and young professionals are two sides of the same coin - both driven by ambition, creativity, and the hunger to grow.
            </p>  
          </div>
        </div>

        <div className='p-6 bg-[#685EFC] rounded-2xl text-white text-lg md:text-xl flex-1 w-full lg:w-auto'>
          <p className='mb-4'>
            We started with a simple question: What if we could make it easier for startups to find the right people and for talents to find the right opportunities no matter where they are in the world?
          </p>

          <p className='font-bold py-6 md:py-10'>
            Today, we are building that bridge - One match at a time.
          </p>

          <p>
            We connect cost-conscious startups with vetted, inexperienced but proven tech talents who have demonstrated their skills through personal projects, hackathon, or open-source contributions.
          </p>
        </div>
      </div>

      <div className='bg-[#685EFC] rounded-2xl text-white w-full lg:w-auto px-2 py-16 text-center lg:hidden mt-10'>
        <div className='mb-2 leading-none'>
          <h2 className='text-[30px] font-bold'>Our Story:</h2>
          <h2 className='text-[30px] font-bold'>Where it all started from</h2>
        </div>
        <div className='p-6 bg-[#685EFC] rounded-2xl text-white'>
          <p className='mb-4'>
            At JuniorForge, we believe startups and young professionals are two sides of the same coin - both driven by ambition, creativity, and the hunger to grow.
          </p>
          <p className='mb-4'>
            We started with a simple question: What if we could make it easier for startups to find the right people and for talents to find the right opportunities no matter where they are in the world?
          </p>

          <p className='font-bold py-6 md:py-10'>
            Today, we are building that bridge - One match at a time.
          </p>

          <p>
            We connect cost-conscious startups with vetted, inexperienced but proven tech talents who have demonstrated their skills through personal projects, hackathon, or open-source contributions.
          </p>  
        </div>
      </div>
    </div>
  )
}

export default Story
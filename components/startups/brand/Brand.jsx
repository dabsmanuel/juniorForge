import React from 'react'
import { startups } from '@/data/db'
import Image from 'next/image'

const Brand = () => {
  return (
    <section className='my-16 max-w-6xl mx-auto lg:px-6 px-4'>
      <div className='mb-6'>
        <h2 className='text-3xl font-bold pb-4 tracking-tight'>Why Brands Trusts Us?</h2>
        <p className='tracking-tight lg:text-2xl pb-4'>JuniorForge delivers pre-vetted talent quickly through a transparent, flexible process built for startup growth. We create lasting partnership that help startups scale and talent thrive.</p>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 lg:gap-6 gap-4'>
        {
          startups.map((startup) =>{
            return (
              <div key={startup.id} >
                <Image
                  src={startup.photo}
                  alt={startup.alt}
                  width={500}
                  height={400}
                  className='rounded-4xl object-cover'
                />
              </div>
            ) 
          })
        }
      </div>
    </section>
  )
}

export default Brand
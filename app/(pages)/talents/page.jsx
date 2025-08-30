import Cta from '@/components/shared/cta/Cta'
import Testimonials from '@/components/shared/testimonials/Testimonials'
import Brand from '@/components/talents/brands/Brand'
import Hero from '@/components/talents/header/Header'
import HowItWorks from '@/components/talents/how/HowItWorks'
import React from 'react'

const page = () => {
  return (
    <>
      <Hero/>
      <Brand/>
      <HowItWorks/>
      <Testimonials/>
      <Cta/>
    </>
  )
}

export default page
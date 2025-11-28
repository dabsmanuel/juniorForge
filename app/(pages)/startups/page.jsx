import Cta from '../../../components/shared/cta/Cta'
import Testimonials from '../../../components/shared/testimonials/Testimonials'
import Brand from '../../../components/startups/brand/Brand'
import TalentHero from '../../../components/startups/header/Header'
import Works from "../../../components/startups/howItWorks/HowItWorks"
import RiskSection from '../.././../components/startups/risk/RiskSection'
import React from 'react'

const page = () => {
  return (
    <>
      <TalentHero/>
      <RiskSection/>
      <Works/>
      <Brand/>
      <Testimonials/>
      <Cta/>
    </>
  )
}

export default page
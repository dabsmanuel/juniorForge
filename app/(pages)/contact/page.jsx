import Contact from '@/components/contact/contact/Contact'
import Form from '@/components/contact/Form/Form'
import Hero from '@/components/contact/header/Hero'
import Impact from '@/components/contact/Impact/Impact'
import React from 'react'

const page = () => {
  return (
    <>
      <Hero/>
      <Form/>
      <Contact/>
      <Impact/>
    </>
  )
}

export default page
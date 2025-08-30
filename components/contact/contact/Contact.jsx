import React from 'react'

const Contact = () => {
  return (
    <div className='lg:max-w-[90%] lg:rounded-e-[56px] bg-[#12895E] px-8 pt-10 pb-26 lg:my-16 text-white'>
      <div className='max-w-5xl mx-auto'>
        <h2 className='font-bold lg:text-[48px] text-[32px]'>Contact Information</h2>

        <div className='bg-[#16252D] p-8 rounded-4xl mt-8 flex flex-col space-y-8'>
          <p>Email Address: juniorforgeltd@gmail.com</p>
          <p>Phone Number: +1 (234) 567-8901</p>
          <p>Social Media:</p>
        </div>      
      </div>
    </div>
  )
}

export default Contact
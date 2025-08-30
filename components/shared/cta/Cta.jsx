import Link from "next/link"

const Cta = () => {
  return (
    <div className='bg-[#685EFC] lg:rounded-4xl py-24 lg:px-16 text-center lg:text-start lg:max-w-6xl lg:mx-auto lg:mt-16 lg:mb-16'>
      <h2 className='lg:text-5xl text-[32px] text-white font-bold lg:px-0 px-16'>Ready to Forge Your Next Move?</h2>
      <p className='text-white pt-4 lg:text-2xl lg:w-[60%] lg:px-0 px-16'>Whether you are hiring or job-hunting, we’re here to make the match easy.</p>
      <div className='mt-6 flex gap-4 justify-center items-center'>
        <Link href='/contact' className='bg-white lg:text-xl text-gray-900 lg:px-28 cursor-pointer px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300'>
          Find Talents
        </Link>
        <Link href='/contact' className='bg-[#16252D] text-white lg:text-xl lg:px-28 cursor-pointer px-8 py-4 border-2 border-[#c1eddd] rounded-full hover:bg-[#1f1f1f] transition-all duration-300'>
          Explore Roles
        </Link>

      </div>
    </div>
  )
}

export default Cta
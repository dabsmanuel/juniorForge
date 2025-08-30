import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
    <main className="relative mt-20">
      <div className='text-center py-12 flex flex-col items-center justify-center max-w-6xl mx-auto'>
        <div className='lg:text-7xl text-3xl font-bold'>
          <h2>Building Careers,</h2>
          <h2>Powering Startups.</h2>
        </div>
        <div className='lg:w-full w-[90%] mx-auto'>
          <p className='py-4 lg:text-2xl'>We connect high-potential talent with innovative startups ready to grow.</p>
        </div>
        <div className='mt-2 flex gap-4 '>
          <Link href='/contact' className='bg-[#685EFC] lg:text-2xl text-base cursor-pointer text-white lg:px-18 px-6 py-4 rounded-full  transition-all duration-300'>
            Find Talents
          </Link>
          <Link href='/contact' className='bg-[#12895E] lg:text-2xl text-base hover:bg-[#37ffb7] cursor-pointer hover:text-black text-white lg:px-10 px-6 py-4  rounded-full  transition-all duration-300'>
            Apply as a Talent
          </Link>
        </div>
      </div>

      {/* Background Logo - positioned behind image container but in front of text section */}
      <div className="absolute inset-x-0 top-[40%] h-[50%] pointer-events-none z-20">
        <Image
          src="/images/green.png" // Replace with your logo path
          alt="Background Logo"
          width={500}
          height={500}
          className="w-full max-w-sm h-auto object-contain opacity-0 lg:opacity-90"
        />
      </div>

      {/* image container */}
      <div className="lg:px-4 px-6 relative z-30 max-w-6xl mx-auto">
        <Image
          src="/images/merge.png"
          alt="JuniorForge Logo"
          width={500}
          height={500}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Text section */}
      <div className='py-12 lg:px-0 lg:px-6 px-4 relative z-10 max-w-6xl mx-auto'>
        <div className='flex lg:flex-row flex-col-reverse justify-between gap-8'>
          <div className='w-full h-full'>
            <Image
              src="/images/girl.png"
              alt="JuniorForge Logo"
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className='lg:w-auto w-full lg:pt-10 text-center lg:text-left'>
            <h2 className='lg:text-4xl text-[32px] font-bold pb-4'>Built by Startup Builders for Startup Builders</h2>
            <p className="">JuniorForge connects early-stage startups with ready-to-grow junior talents. We exist to close the experience gap and create opportunity where it matters most.</p>
            <div className='mt-4'>
              <Link href='/about' className='bg-[#12895E] text-white lg:px-8 px-4 py-4 rounded-full transition-all duration-300 lg:w-fit w-full'>
                Learn more...
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Header
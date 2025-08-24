import { startup, talents } from "@/data/db"
import Link from "next/link"

const WhoWeHelp = () => {
  return (
    <section className="bg-[#16252D] py-16 text-white">
      <div className='max-w-6xl mx-auto lg:px-0 px-6'>
        <h2 className='lg:text-4xl text-[32px] font-bold py-4'>Who We Help</h2>
        <p className='lg:w-3/5'>We bridge the gap between fast-growing startups and ambitious talent, creating partnerships that drive innovation and career growth.</p>
      </div>
      <div className='border-b border-white py-8'></div>

      <div className='max-w-6xl mx-auto pt-16 lg:px-0 px-6'>
        <h2 className='text-4xl font-bold py-4 uppercase'>For startups</h2>
        <ul className="list-disc pl-6">
          {startup.map((item, index) => (
            <li key={index} className='py-2'>{item.text}</li>
          ))}
        </ul>
        <div className="mt-4">
        <Link href="/startups" className="text-[#16252D] bg-white px-6 py-2 rounded-full">See How it Works</Link>
        </div>
      </div>

      <div className='border-b border-white py-8'></div>

      <div className='max-w-6xl mx-auto pt-16 lg:px-0 px-6'>
        <h2 className='text-4xl font-bold py-4 uppercase'>For Talents</h2>
        <ul className="list-disc pl-6">
          {talents.map((item, index) => (
            <li key={index} className='py-2'>{item.text}</li>
          ))}
        </ul>
        <div className="mt-4">
        <Link href="/talents" className="text-[#16252D] bg-white px-6 py-2 rounded-full">See How it Works</Link>
        </div>
      </div>
    </section>
  )
}

export default WhoWeHelp
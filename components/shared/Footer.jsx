'use client';
import Image from "next/image"
import { FaFacebookSquare, FaInstagramSquare} from "react-icons/fa";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  if (pathname === '/auth' || pathname.startsWith('/auth/') || pathname === '/account' || pathname.startsWith('/dashboard/')) {
    return null;
  }

  return (
    <footer className="bg-[#16252D] ">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex lg:flex-row flex-col lg:justify-between justify-center">
          <div className="flex items-center justify-center w-full lg:w-auto lg:mb-0 mb-20">
            <Link href='/'>
              <Image
                src='/images/juniorforge.png'
                alt="logo"
                height={150}
                width={150}
              />
            </Link>
          </div>

          <div className="flex lg:flex-row flex-col gap-8 items-center text-white">
            <Link href='/' className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href='/about' className="hover:text-gray-300 transition-colors">About</Link>
            <Link href='/startups' className="hover:text-gray-300 transition-colors">For Startups</Link>
            <Link href='/talents' className="hover:text-gray-300 transition-colors">For Talents</Link>
            <div className="lg:block hidden">
              <Link href='/contact' className="hover:text-gray-300 transition-colors">Contact Us</Link>
            </div>
            <div className="lg:hidden block mt-8 mb-4">
              <Link href='/contact' className="bg-[#12895E] text-white border border-white rounded-full px-32 py-4 hover:bg-[#0f7a52] transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <div className="flex gap-1 items-center lg:justify-end justify-center mt-8 text-white pb-16">
          <a href="https://www.facebook.com/profile.php?id=100063945017359" className="hover:text-[#685EFC] transition-colors" aria-label="Facebook">
            <FaFacebookSquare className="w-8 h-8"/>
          </a>
          <a href="https://www.linkedin.com/company/junior-forge/posts/?feedView=all" className="hover:text-[#685EFC] transition-colors" aria-label="LinkedIn">
            <FaLinkedin className="w-8 h-8"/>
          </a>
          <a href="https://www.instagram.com/junior_forge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="hover:text-[#685EFC] transition-colors" aria-label="Instagram">
            <FaInstagramSquare className="w-8 h-8"/>
          </a>

          <a href="https://x.com/junior_forge" className="hover:text-[#685EFC] transition-colors" aria-label="Twitter">
            <FaSquareXTwitter className="w-8 h-8"/>
          </a>
        </div>

        <hr className="border-white/30" />

        <div className="text-center pt-6">
          <p className="text-white lg:text-base text-sm">
            &copy; {currentYear} JuniorForge. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
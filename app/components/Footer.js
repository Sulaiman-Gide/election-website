import React from 'react'
import Link from 'next/link';
import { BsInstagram } from "react-icons/bs";
import { LiaFacebook } from 'react-icons/lia';
import { FiTwitter } from 'react-icons/fi';

function Footer() {
  return (
    <div>
      <div className='flex flex-row justify-between items-center pt-4 pb-3 px-3 sm:px-5 lg:px-14 font-serif select-none bg-[#0E5D8A]'>
      <h1 className=' text-gray-50 lg:text-4xl text-2xl antialiased cursor-pointer hover:opacity-65'>CEOSA Decides</h1>
        <div
         className='flex flex-row items-center'>
            <Link href="#" target='_blank' className=''>
             <FiTwitter className="text-base sm:text-xl mx-2 text-slate-50 hover:text-gray-400 cursor-pointer"/>
            </Link>
            <Link href="#" className=''>
             <BsInstagram className="text-base sm:text-xl mx-2 text-slate-50 hover:text-gray-400 cursor-pointer"/>
            </Link>
            <Link href="#" className=''>
                <LiaFacebook className="text-lg sm:text-2xl mx-2 text-slate-50 hover:text-gray-400 cursor-pointer"/>
            </Link>
        </div>
      </div>
      <p className='text-sm sm:text-base text-slate-800 py-3 bg-gray-100 text-center font-serif'> <span className="font-sans">Copyright &#169; 2024.</span>foodlify, All rights reserved. Powered by QI solutions and services</p>
    </div>

  )
}

export default Footer
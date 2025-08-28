import { Link } from '@inertiajs/react'
import React from 'react'
import { FaShieldAlt } from 'react-icons/fa'

export default function Navbar({ onOpenLogin, isAdmin }) {
  const handleAdminClick = () => {
    if (isAdmin) {
      // langsung redirect ke halaman admin
      window.location.href = '/admin'
    } else {
      // tampilkan modal login
      onOpenLogin()
    }
  }

  return (
    <div className="w-screen fixed top-0 left-0 py-5 text-gray-200 backdrop-blur-sm px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <a href="#" className='text-gray-200 font-bold text-2xl md:text-3xl cursor-pointer'>
          PostIt
        </a>
        <button
          onClick={handleAdminClick}
          className='text-lg hover:text-[#0891b2] transition-all duration-200 cursor-pointer'
        >
          <FaShieldAlt />
        </button>
      </div>
    </div>
  )
}

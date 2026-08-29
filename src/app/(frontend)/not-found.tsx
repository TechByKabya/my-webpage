'use client'

import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import '@dotlottie/react-player/dist/index.css'
import { motion } from 'framer-motion'

const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
  { ssr: false }
)

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative"
      style={{ backgroundColor: '#ffffff', zIndex: 99999 }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto flex flex-col items-center"
      >
        <div className="w-full max-w-sm mb-8">
          <DotLottiePlayer
            src="/404-animation.json"
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-20 tracking-tight">
          Page Not Found
        </h1>

        <Link 
          href="/" 
          className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] hover:-translate-y-0.5"
        >
          <span>Go Back Home</span>
          <svg 
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </motion.div>
    </div>
  )
}


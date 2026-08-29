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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#fbfbfd',
      zIndex: 9999999, // Cover header and chatbot completely
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Bigger animation container */}
        <div style={{ width: '100%', maxWidth: '650px', marginBottom: '10px' }}>
          <DotLottiePlayer
            src="/404-sleep-cat.json"
            autoplay
            loop
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: '#1d1d1f',
          letterSpacing: '-0.04em',
          marginBottom: '16px'
        }}>
          Looks like you're lost.
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
          color: '#86868b',
          marginBottom: '48px',
          maxWidth: '500px',
          lineHeight: 1.5
        }}>
          We can't find the page you're looking for. Let's get you back on track.
        </p>

        <style>{`
          .apple-home-btn {
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 18px 40px;
            background: #1d1d1f;
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 999px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 14px rgba(0,0,0,0.1);
          }
          .apple-home-btn:hover {
            background: #000000;
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
          .apple-home-btn:active {
            transform: scale(0.98);
          }
        `}</style>

        <Link href="/" className="apple-home-btn">
          <span>Go to Homepage</span>
        </Link>
      </motion.div>
    </div>
  )
}

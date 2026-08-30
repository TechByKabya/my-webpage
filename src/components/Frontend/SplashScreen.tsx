'use client'

import React, { useEffect, useRef, useState } from 'react'

interface SplashScreenProps {
  logoVideoUrl?: string
}

export const SplashScreen = ({ logoVideoUrl }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const dismissedRef = useRef(false)

  const dismiss = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setFading(true)
    setTimeout(() => setVisible(false), 550)
  }

  useEffect(() => {
    // Temporarily disabled session storage check so you can always see the loading screen while testing
    // if (sessionStorage.getItem('splashShown')) {
    //   setVisible(false)
    //   return
    // }
    // sessionStorage.setItem('splashShown', '1')

    // Minimum display time so it doesn't just flash
    const MIN_MS = 800
    const startTime = Date.now()

    const tryDismiss = () => {
      const elapsed = Date.now() - startTime
      const remaining = MIN_MS - elapsed
      if (remaining > 0) {
        setTimeout(dismiss, remaining)
      } else {
        dismiss()
      }
    }

    // Fire when ALL resources (images, fonts, scripts) are loaded
    if (document.readyState === 'complete') {
      tryDismiss()
    } else {
      window.addEventListener('load', tryDismiss, { once: true })
    }

    // Hard cap: never show for more than 5s regardless
    const hardCap = setTimeout(dismiss, 5000)

    return () => {
      window.removeEventListener('load', tryDismiss)
      clearTimeout(hardCap)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Logo video or text fallback */}
      {logoVideoUrl ? (
        <video
          ref={videoRef}
          src={logoVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: '180px',
            height: '180px',
            objectFit: 'contain',
            borderRadius: '24px',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#1d1d1f',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-0.04em',
          }}
        >
          Kabya<span style={{ color: '#6366f1' }}>.Dev</span>
        </div>
      )}

      {/* Animated loading bar at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: '#f3f4f6',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #1d1d1f, #6366f1, #8b5cf6)',
            animation: 'splashProgressBar 2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes splashProgressBar {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

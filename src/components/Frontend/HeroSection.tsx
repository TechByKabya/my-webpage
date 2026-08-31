'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '50%'
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
      </div>
    )
  }
)
import '@dotlottie/react-player/dist/index.css'

interface HeroSectionProps {
  heroTitle: string
  heroBio: string
  heroBadgeText: string
  heroPhotoUrl: string
  heroFloatCard1Icon: string
  heroFloatCard1Text: string
  heroFloatCard2Icon: string
  heroFloatCard2Text: string
  isHeroVideo?: boolean
}

// Simple Typing Effect Hook
function useTypewriter(text: string, speed = 100) {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let i = 0;
    // reset
    setDisplayText('')
    const intervalId = setInterval(() => {
      setDisplayText(text.slice(0, i + 1))
      i++
      if (i === text.length) clearInterval(intervalId)
    }, speed)
    return () => clearInterval(intervalId)
  }, [text, speed])

  return displayText
}

export const HeroSection = ({
  heroTitle,
  heroBio,
  heroBadgeText,
  heroPhotoUrl,
  heroFloatCard1Icon,
  heroFloatCard1Text,
  heroFloatCard2Icon,
  heroFloatCard2Text,
  isHeroVideo = false
}: HeroSectionProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if (desktopVideoRef.current && desktopVideoRef.current.readyState >= 3) {
      setIsVideoLoaded(true)
    }
    if (mobileVideoRef.current && mobileVideoRef.current.readyState >= 3) {
      setIsVideoLoaded(true)
    }
  }, [heroPhotoUrl])
  
  const { scrollY } = useScroll()
  
  // Apple-like Parallax Scroll Effects
  const yText = useTransform(scrollY, [0, 500], [0, 150])
  const opacityText = useTransform(scrollY, [0, 300], [1, 0])
  const scaleImage = useTransform(scrollY, [0, 500], [1, 1.05])
  const yImage = useTransform(scrollY, [0, 500], [0, 50])

  const rawText = heroTitle.replace(/<br\s*\/?>/gi, '\n')
  const typedText = useTypewriter(rawText, 80)

  return (
    <section id="hero" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* --- Desktop View --- */}
      <div className="desktop-hero-layout responsive-flex-column" style={{ 
        paddingTop: '40px',
        paddingBottom: '80px',
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingLeft: '20px',
        paddingRight: '20px',
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '60px',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Left Text Block */}
        <motion.div 
          className="hero-text"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', zIndex: 10, y: yText, opacity: opacityText }}
        >
          {heroBadgeText && (
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="badge"
            >
              {heroBadgeText}
            </motion.span>
          )}
          
          <h1 className="hero-title-3d" style={{ whiteSpace: 'pre-line' }}>
             {typedText}
             <motion.span 
               animate={{ opacity: [1, 0] }}
               transition={{ repeat: Infinity, duration: 0.8 }}
             >
               |
             </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="bio"
          >
            {heroBio}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="hero-btns"
          >
            <a href="/projects" className="btn-primary">View Work</a>
            <a href="#contact" className="btn-secondary">Contact</a>
          </motion.div>
        </motion.div>

        {/* Right 3D Visual Block */}
        <motion.div 
          className="hero-visual"
          style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', perspective: '1000px', y: yImage, scale: scaleImage }}
        >
          <motion.div 
            whileHover={{ rotateY: -10, rotateX: 5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="tilt-card"
          >
            {/* Float Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: 'spring' }}
              className="float-card f-1"
            >
              <div className="icon-box">
                <i className={heroFloatCard1Icon}></i>
              </div>
              <span>{heroFloatCard1Text}</span>
            </motion.div>

            {/* Float Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="float-card f-2"
            >
              <div className="icon-box">
                <i className={heroFloatCard2Icon}></i>
              </div>
              <span>{heroFloatCard2Text}</span>
            </motion.div>

            {isHeroVideo || heroPhotoUrl?.match(/\.(mp4|webm|mov)$/i) ? (
              <>
                {!isVideoLoaded && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DotLottiePlayer
                      src="/lottie/Profile-Avatar.json"
                      background="transparent"
                      speed={1}
                      style={{ width: '100%', height: '100%' }}
                      loop
                      autoplay
                    />
                  </div>
                )}
                <video 
                  ref={desktopVideoRef}
                  src={heroPhotoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  preload="auto"
                  className="profile-photo"
                  style={{ objectFit: 'cover', opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.3s ease', position: 'relative', zIndex: 1 }}
                  onLoadedData={() => setIsVideoLoaded(true)}
                />
              </>
            ) : (
              <Image src={heroPhotoUrl} alt="Kabya Ghosh - Embedded System IoT Engineer at Daffodil International University" width={500} height={500} priority={true} className="profile-photo" style={{ objectFit: 'cover' }} onLoad={() => setIsVideoLoaded(true)} />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* --- Mobile View --- */}
      <div className="mobile-hero-layout">
        <div className="mobile-hero-bg"></div>
        
        <div className="mobile-hero-top">
          <div className="mobile-hero-avatar" style={{ position: 'relative' }}>
            {isHeroVideo || heroPhotoUrl?.match(/\.(mp4|webm|mov)$/i) ? (
              <>
                {!isVideoLoaded && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DotLottiePlayer
                      src="/lottie/Profile-Avatar.json"
                      background="transparent"
                      speed={1}
                      style={{ width: '100%', height: '100%' }}
                      loop
                      autoplay
                    />
                  </div>
                )}
                <video 
                  ref={mobileVideoRef}
                  src={heroPhotoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  preload="auto"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 0.3s ease', position: 'relative', zIndex: 1 }}
                  onLoadedData={() => setIsVideoLoaded(true)}
                />
              </>
            ) : (
              <Image 
                src={heroPhotoUrl} 
                alt="Profile Photo" 
                fill
                style={{ objectFit: 'cover' }}
                priority={true} 
                onLoad={() => setIsVideoLoaded(true)}
              />
            )}
          </div>
          
          <div className="mobile-hero-divider"></div>
          
          <div className="mobile-hero-text-side">
            {heroBadgeText && (
              <span className="badge">
                {heroBadgeText}
              </span>
            )}
            <h1 className="hero-title-3d" style={{ whiteSpace: 'pre-line' }}>
               {typedText}
               <motion.span 
                 animate={{ opacity: [1, 0] }}
                 transition={{ repeat: Infinity, duration: 0.8 }}
               >
                 |
               </motion.span>
            </h1>
          </div>
        </div>

        <div className="mobile-hero-bottom">
          <p className="bio">
            {heroBio}
          </p>
          <div className="hero-btns">
            <a href="/projects" className="btn-primary">View Work</a>
            <a href="#contact" className="btn-secondary">Contact</a>
          </div>

          <div className="mobile-hero-lottie">
            <DotLottiePlayer
              src="/lottie/Web-Development.json"
              background="transparent"
              speed={1}
              style={{ width: '100%', height: '100%' }}
              loop
              autoplay
            />
          </div>
        </div>

        <div className="mobile-scroll-indicator">
          <DotLottiePlayer
            src="/lottie/Arrow-Down-New.json"
            background="transparent"
            speed={1}
            style={{ width: '60px', height: '60px' }}
            loop
            autoplay
          />
        </div>
      </div>
    </section>
  )
}

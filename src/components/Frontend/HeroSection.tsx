'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

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

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroTitle,
  heroBio,
  heroBadgeText,
  heroPhotoUrl,
  heroFloatCard1Icon,
  heroFloatCard1Text,
  heroFloatCard2Icon,
  heroFloatCard2Text,
  isHeroVideo
}) => {
  const { scrollY } = useScroll()
  
  // Apple-like Parallax Scroll Effects
  const yText = useTransform(scrollY, [0, 500], [0, 150])
  const opacityText = useTransform(scrollY, [0, 300], [1, 0])
  const scaleImage = useTransform(scrollY, [0, 500], [1, 1.05])
  const yImage = useTransform(scrollY, [0, 500], [0, 50])

  const rawText = heroTitle.replace(/<br\s*\/?>/gi, '\n')
  const typedText = useTypewriter(rawText, 80)

  return (
    <section id="hero" style={{ paddingTop: '120px', paddingBottom: '80px', overflow: 'hidden' }}>
      <div className="responsive-flex-column" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px',
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
              <video 
                src={heroPhotoUrl} 
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="auto"
                className="profile-photo"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Image src={heroPhotoUrl} alt="Kabya Ghosh - Embedded System IoT Engineer at Daffodil International University" width={500} height={500} priority={true} className="profile-photo" style={{ objectFit: 'cover' }} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

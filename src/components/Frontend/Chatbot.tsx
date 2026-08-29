// @ts-nocheck

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottiePlayer } from '@dotlottie/react-player'
import '@dotlottie/react-player/dist/index.css'

type Message = { role: 'user' | 'assistant'; content: string; id: string }

export const Chatbot = ({ initialMessage }: { initialMessage: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: initialMessage },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Robot state
  const [currentMessage, setCurrentMessage] = useState("Hi! Let me know if you need help.")
  const [showBubble, setShowBubble] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const activeSectionRef = useRef<string | null>(null)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Web Audio API for cute soft pop sound
  const playCutePop = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1); 

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.02); 
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); 

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be blocked if no user interaction yet, ignore silently
    }
  }

  const sectionMessages: Record<string, string> = {
    'section-hero': 'Hi! Welcome to my portfolio!',
    'section-skills': 'Check out the tools I use every day.',
    'section-projects': 'Here are some of my featured projects!',
    'section-blogs': 'Read my latest articles and insights.',
    'section-contact': 'Got a question? Send me a message!',
    'section-footer': 'Thanks for visiting! Connect with me.',
  }

  // Intersection Observer for predefined section messages
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Focus on center of screen
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSectionRef.current = entry.target.id
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    
    // Observe sections
    const sections = document.querySelectorAll('div[id^="section-"], section[id^="section-"]')
    sections.forEach(sec => observer.observe(sec))

    return () => observer.disconnect()
  }, [])

  // Smart scroll logic: hide on scroll, show after settling, then hide again
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let hideTimeout: NodeJS.Timeout
    let initialHideDelay: NodeJS.Timeout
    
    const onScroll = () => {
      if (!isOpen) {
        clearTimeout(scrollTimeout)
        clearTimeout(hideTimeout)
        
        // Add a minor delay (150ms) to hiding, so tiny bumps don't instantly snap it away
        clearTimeout(initialHideDelay)
        initialHideDelay = setTimeout(() => {
          setShowBubble(false)
        }, 150)
        
        // When they stop scrolling for 800ms, organically show the bubble
        scrollTimeout = setTimeout(() => {
          clearTimeout(initialHideDelay) // cancel the hide if they stopped super fast
          
          const currentSec = activeSectionRef.current
          if (currentSec && sectionMessages[currentSec]) {
            // Check if we've shown this message in this session
            const shownMessages = JSON.parse(sessionStorage.getItem('shownGuideMessages') || '[]')
            
            if (!shownMessages.includes(currentSec)) {
              // Not shown yet, show it and mark it
              setCurrentMessage(sectionMessages[currentSec])
              setShowBubble(true)
              playCutePop()
              shownMessages.push(currentSec)
              sessionStorage.setItem('shownGuideMessages', JSON.stringify(shownMessages))
              
              // And then hide it again after 4 seconds so it doesn't linger forever
              hideTimeout = setTimeout(() => {
                setShowBubble(false)
              }, 4000)
            }
          }
        }, 800)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    
    // Initial check for the hero section or first load
    const shownMessages = JSON.parse(sessionStorage.getItem('shownGuideMessages') || '[]')
    if (!shownMessages.includes('section-hero')) {
      setShowBubble(true)
      setCurrentMessage(sectionMessages['section-hero'])
      playCutePop()
      shownMessages.push('section-hero')
      sessionStorage.setItem('shownGuideMessages', JSON.stringify(shownMessages))
      hideTimeout = setTimeout(() => setShowBubble(false), 5000)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(scrollTimeout)
      clearTimeout(hideTimeout)
      clearTimeout(initialHideDelay)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen])

  const sendMessage = async () => {
    const userText = text.trim()
    if (!userText || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setText('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (res.status === 401) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'assistant', content: 'Sorry, the AI is currently unavailable (API Key missing or invalid).' },
        ])
        setIsLoading(false)
        return
      }

      if (!res.ok) throw new Error('API error')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let botText = ''
      const botId = (Date.now() + 1).toString()

      setMessages(prev => [...prev, { id: botId, role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          botText += decoder.decode(value, { stream: true })
          setMessages(prev =>
            prev.map(m => m.id === botId ? { ...m, content: botText } : m)
          )
        }
      }

      if (!botText.trim()) {
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, content: 'Sorry, the AI is currently unavailable (API Key missing or invalid).' } : m)
        )
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  // Robot animation variants
  const floatVariants = {
    animate: {
      y: [0, -15, 0, 10, 0],
      x: [0, 10, -5, 5, 0],
      rotate: [0, 3, -2, 2, 0],
      scale: [1, 1.03, 0.97, 1.02, 1], 
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror" as const,
      }
    },
    hover: {
      scale: 1.15,
      y: -5,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: isMobile ? '20px' : '40px', right: isMobile ? '10px' : '40px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'none' }}>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              pointerEvents: 'auto',
              width: '340px',
              height: '480px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.95)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1d1d1f', fontFamily: 'system-ui, sans-serif' }}>Kabya AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#9ca3af', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>

            {/* Messages Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? '#1d1d1f' : '#f1f5f9',
                    color: m.role === 'user' ? '#fff' : '#1d1d1f',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    fontFamily: 'system-ui, sans-serif',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {m.content || (m.role === 'assistant' && isLoading ? '...' : '')}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '18px 18px 18px 4px', background: '#f1f5f9', color: '#6b7280', fontSize: '0.875rem' }}>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.95)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '100px',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#1d1d1f',
                  fontFamily: 'system-ui, sans-serif',
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                style={{
                  width: '38px',
                  height: '38px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  border: 'none',
                  background: !isLoading && text.trim() ? '#1d1d1f' : '#e5e7eb',
                  color: '#fff',
                  cursor: !isLoading && text.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <i className="fas fa-paper-plane" style={{ fontSize: '0.75rem' }}></i>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ROBOT TOGGLE / SCROLL TOOLTIP */}
      {!isOpen && (
        <>
          <AnimatePresence>
            {currentMessage && showBubble && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  borderBottomRightRadius: '4px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  marginBottom: '10px',
                  marginRight: '20px', 
                  maxWidth: '220px',
                  textAlign: 'center',
                  color: '#1d1d1f',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  pointerEvents: 'auto',
                }}
              >
                {currentMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={floatVariants}
            animate={isHovered ? "hover" : "animate"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
            style={{
              width: isMobile ? '90px' : '110px',
              height: isMobile ? '90px' : '110px',
              pointerEvents: 'auto',
              cursor: 'pointer',
              // Add a subtle drop shadow to make it pop out like a button
              filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15))',
            }}
          >
            <DotLottiePlayer
              src="/ai-robot-animation.json"
              autoplay
              loop
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>
        </>
      )}

    </div>
  )
}

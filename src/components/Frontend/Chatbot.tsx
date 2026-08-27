// @ts-nocheck

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'

export const Chatbot = ({ initialMessage }: { initialMessage: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: initialMessage },
    ],
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    append({ role: 'user', content: text })
    setText('')
  }

  return (
    <div className="chatbot-wrapper" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="chatbot-window open" // using existing CSS classes for now
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              width: '350px',
              height: '500px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1d1d1f' }}>Kabya AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#6b7280', cursor: 'pointer' }}>&times;</button>
            </div>

            {/* Messages Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    background: m.role === 'user' ? '#1d1d1f' : '#f3f4f6',
                    color: m.role === 'user' ? '#fff' : '#1d1d1f',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
                  }}>
                    {m.content as string}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '16px', background: '#f3f4f6', color: '#1d1d1f', fontSize: '0.9rem', borderBottomLeftRadius: '4px' }}>
                    <i className="fas fa-circle-notch fa-spin"></i> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.05)', background: '#fff', display: 'flex', gap: '8px' }}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '100px',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#1d1d1f'
                }}
              />
              <button 
                type="submit" 
                disabled={isLoading || !text.trim()}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: text.trim() ? '#1d1d1f' : '#e5e7eb',
                  color: '#fff',
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <i className="fas fa-paper-plane" style={{ fontSize: '0.8rem' }}></i>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOGGLE BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #1d1d1f, #333336)',
          color: '#fff',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: '0',
          right: '0'
        }}
      >
        <i className={isOpen ? "fas fa-times" : "fas fa-comment-dots"}></i>
      </motion.button>

    </div>
  )
}

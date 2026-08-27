// @ts-nocheck

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
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

      {/* TOGGLE BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #1d1d1f, #3a3a3f)',
          color: '#fff',
          fontSize: '1.4rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className={isOpen ? 'fas fa-times' : 'fas fa-comment-dots'}></i>
      </motion.button>

    </div>
  )
}

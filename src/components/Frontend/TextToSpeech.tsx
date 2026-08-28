'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, Square } from 'lucide-react'

interface TextToSpeechProps {
  targetId: string;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ targetId }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Map to hold text nodes for highlighting mapping
  const textNodesRef = useRef<{ node: Text; start: number; end: number }[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false)
      return
    }

    // Load voices on mount to avoid delay
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }
    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel()
      clearHighlight()
    }
  }, [])

  const clearHighlight = () => {
    if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
      // @ts-ignore - TypeScript doesn't fully support CSS highlights API yet
      CSS.highlights.delete('ai-reading')
    } else {
      window.getSelection()?.removeAllRanges()
    }
  }

  const highlightText = (charIndex: number, charLength: number) => {
    if (charLength === 0) return

    const nodes = textNodesRef.current
    let targetNodeObj = null
    let localStart = 0

    // Find the text node that contains the charIndex
    for (const n of nodes) {
      if (charIndex >= n.start && charIndex < n.end) {
        targetNodeObj = n
        localStart = charIndex - n.start
        break
      }
    }

    if (!targetNodeObj) return

    const node = targetNodeObj.node
    const localEnd = Math.min(localStart + charLength, node.length)

    try {
      const range = new Range()
      range.setStart(node, localStart)
      range.setEnd(node, localEnd)

      if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
        // @ts-ignore
        const highlight = new Highlight(range)
        // @ts-ignore
        CSS.highlights.set('ai-reading', highlight)
      } else {
        // Fallback for older browsers
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    } catch (e) {
      console.error("Highlight error:", e)
    }
  }

  const buildTextMapAndGetText = (container: HTMLElement) => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null)
    let currentNode: Node | null
    let globalIndex = 0
    let fullText = ""
    const nodes = []

    while ((currentNode = walker.nextNode())) {
      const text = currentNode.nodeValue || ""
      // We only care about nodes that have some content
      if (text.trim().length > 0) {
        nodes.push({
          node: currentNode as Text,
          start: globalIndex,
          end: globalIndex + text.length
        })
      }
      globalIndex += text.length
      fullText += text
    }

    textNodesRef.current = nodes
    return fullText
  }

  const handleToggle = () => {
    if (!window.speechSynthesis) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      clearHighlight()
      return
    }

    const container = document.getElementById(targetId)
    if (!container) return

    // Pre-process text and nodes for highlighting
    const fullText = buildTextMapAndGetText(container)

    // Stop any existing speech
    window.speechSynthesis.cancel()
    clearHighlight()

    const utterance = new SpeechSynthesisUtterance(fullText)
    utteranceRef.current = utterance

    // Try to pick a good English voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Google') || v.name.includes('Samantha')))
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onstart = () => setIsPlaying(true)
    
    utterance.onend = () => {
      setIsPlaying(false)
      clearHighlight()
    }
    
    utterance.onerror = () => {
      setIsPlaying(false)
      clearHighlight()
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Get the length of the word (roughly)
        // Utterance API doesn't always provide charLength accurately in all browsers
        const length = event.charLength || fullText.substring(event.charIndex).split(/\s/)[0].length || 1
        highlightText(event.charIndex, length)
      }
    }

    window.speechSynthesis.speak(utterance)
  }

  if (!isSupported) return null

  return (
    <div className="text-to-speech-wrapper" style={{ margin: '15px 0' }}>
      <button
        onClick={handleToggle}
        className="tts-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isPlaying ? '#ef4444' : '#f8fafc',
          color: isPlaying ? '#ffffff' : '#0f172a',
          border: '1px solid',
          borderColor: isPlaying ? '#ef4444' : '#e2e8f0',
          padding: '8px 16px',
          borderRadius: '50px',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}
      >
        {isPlaying ? (
          <>
            <Square size={16} fill="currentColor" />
            Stop AI Reading
          </>
        ) : (
          <>
            <Volume2 size={16} />
            Listen to this post
          </>
        )}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        ::highlight(ai-reading) {
          background-color: #fef08a; /* yellow-200 */
          color: #000;
        }
        
        .tts-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
        }
      `}} />
    </div>
  )
}

'use client'
import React, { useState, useEffect } from 'react'
import { DotLottiePlayer } from '@dotlottie/react-player'

export default function TestPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return <DotLottiePlayer src="/lottie/Profile-Avatar.json" />
}

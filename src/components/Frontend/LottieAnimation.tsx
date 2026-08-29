'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
  { ssr: false }
)

export function LottieAnimation({ src, style }: { src: string, style?: React.CSSProperties }) {
  return (
    <DotLottiePlayer
      src={src}
      autoplay
      loop
      style={style}
    />
  )
}

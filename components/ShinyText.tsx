"use client"

import React from 'react'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number // seconds per loop
  className?: string
  baseColor?: string
}

// Solid base text + animated overlay clipped to text so the text never dims
const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  className = '',
  baseColor = '#b5b5b5a4',
}) => {
  const duration = `${speed}s`

  return (
    <span className={`relative inline-block ${className}`} style={{ color: baseColor }}>
      {/* Base text remains visible */}
      <span className="relative z-0">{text}</span>
      {/* Shimmer overlay */}
      <span
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none text-transparent bg-clip-text"
        style={{
          WebkitBackgroundClip: 'text',
          backgroundImage:
            'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 60%)',
          backgroundSize: '300% 100%',
          backgroundPosition: '200% 0',
          animation: disabled ? 'none' : `shineMove ${duration} linear infinite`,
          willChange: 'background-position',
          mixBlendMode: 'plus-lighter',
        }}
      >
        {text}
      </span>
      <style jsx global>{`
        @keyframes shineMove {
          0% { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </span>
  )
}

export default ShinyText

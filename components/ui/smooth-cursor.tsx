"use client"

import { FC, useEffect, useRef } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface Position {
  x: number
  y: number
}

export interface SmoothCursorProps {
  cursor?: React.ReactNode
  springConfig?: {
    damping: number
    stiffness: number
    mass: number
    restDelta?: number
    restSpeed?: number
  }
}

const DefaultCursorSVG: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 35,
    stiffness: 700,
    mass: 0.4,
    restDelta: 0.001,
    restSpeed: 0.01,
  },
}: SmoothCursorProps) {
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef(performance.now())
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)
  const scaleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ultra-responsive spring configs with smooth stop behavior
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    damping: 40,
    stiffness: 600,
    mass: 0.5,
    restDelta: 0.001,
    restSpeed: 0.01,
  })
  const scale = useSpring(1, {
    damping: 30,
    stiffness: 700,
    mass: 0.4,
    restDelta: 0.001,
    restSpeed: 0.01,
  })

  useEffect(() => {
    let rafId: number | null = null

    const updateVelocity = (currentPos: Position) => {
      const currentTime = performance.now()
      const deltaTime = Math.max(currentTime - lastUpdateTime.current, 1)

      velocity.current = {
        x: (currentPos.x - lastMousePos.current.x) / deltaTime,
        y: (currentPos.y - lastMousePos.current.y) / deltaTime,
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const currentPos = { x: e.clientX, y: e.clientY }
        updateVelocity(currentPos)

        const speed = Math.sqrt(
          velocity.current.x ** 2 + velocity.current.y ** 2
        )

        // Update position immediately for responsiveness
        cursorX.set(currentPos.x)
        cursorY.set(currentPos.y)

        if (speed > 0.03) {
          const currentAngle =
            Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
            90

          // Smooth angle transitions
          let angleDiff = currentAngle - previousAngle.current
          while (angleDiff > 180) angleDiff -= 360
          while (angleDiff < -180) angleDiff += 360
          
          accumulatedRotation.current += angleDiff
          rotation.set(accumulatedRotation.current)
          previousAngle.current = currentAngle

          // Smooth scale animation with less aggressive squish
          scale.set(0.94)
          
          // Clear previous timeout
          if (scaleTimeoutRef.current) {
            clearTimeout(scaleTimeoutRef.current)
          }
          
          scaleTimeoutRef.current = setTimeout(() => {
            scale.set(1)
          }, 80)
        }

        rafId = null
      })
    }

    // Hide default cursor and add event listener
    document.body.style.cursor = "none"
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "auto"
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (scaleTimeoutRef.current) {
        clearTimeout(scaleTimeoutRef.current)
      }
    }
  }, [cursorX, cursorY, rotation, scale])

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        x: "-50%",
        y: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
        transform: "translateZ(0)", // GPU acceleration
        backfaceVisibility: "hidden", // Optimize rendering
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 35,
      }}
    >
      {cursor}
    </motion.div>
  )
}

// src/components/products/CountdownTimer.tsx
'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  endDate: Date
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const distance = end - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft('EXPIRED')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="text-sm font-mono">
      Sale ends in: {timeLeft}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  endDate: Date
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const distance = end - now

      if (distance < 0) {
        setIsExpired(true)
        setTimeLeft('EXPIRED')
        return true
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      const timeString = [
        days && `${days}d`,
        hours && `${hours}h`,
        minutes && `${minutes}m`,
        `${seconds}s`
      ].filter(Boolean).join(' ')

      setTimeLeft(timeString)
      return false
    }

    const isInitiallyExpired = calculateTimeLeft()

    if (isInitiallyExpired) {
      return
    }
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-sm font-mono px-3 py-1 rounded-full inline-flex items-center w-max ${
        isExpired
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${
        isExpired ? 'bg-red-500' : 'bg-green-500 animate-pulse'
      }`} />
      {isExpired ? 'Sale Ended' : `Sale ends in: ${timeLeft}`}
    </motion.div>
  )
}

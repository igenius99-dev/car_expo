'use client'

import { motion } from 'framer-motion'
import { Car, Loader2 } from 'lucide-react'

interface CarLoadingBarProps {
  isLoading: boolean
  message?: string
}

export default function CarLoadingBar({ isLoading, message = "Loading cars..." }: CarLoadingBarProps) {
  if (!isLoading) return null

  return (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated car icon */}
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <Car className="w-16 h-16 text-blue-400" />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2"
          >
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </motion.div>
        </motion.div>

        {/* Loading message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
          <p className="text-white/70 text-sm">Finding the perfect cars for you...</p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center space-y-2 text-sm text-white/60"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: 0
            }}
          >
            Searching car listings...
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
          >
            Analyzing car ratings...
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: 1
            }}
          >
            Matching your preferences...
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

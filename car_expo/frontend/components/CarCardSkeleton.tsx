'use client'

import { motion } from 'framer-motion'

interface CarCardSkeletonProps {
  isPreview?: boolean
  previewSide?: 'left' | 'right'
}

export default function CarCardSkeleton({ isPreview = false, previewSide }: CarCardSkeletonProps) {
  return (
    <div className={`w-full h-full relative rounded-2xl overflow-hidden 
                     border border-white/30 bg-white/10 backdrop-blur-lg shadow-md
                     ${isPreview ? 'opacity-50' : ''}`}>
      
      {/* Image skeleton */}
      <div className="w-full h-full bg-gradient-to-br from-gray-300/20 to-gray-500/20 relative">
        <motion.div
          animate={{ 
            background: [
              'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
              'linear-gradient(90deg, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%, rgba(255,255,255,0.1) 0%)',
              'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)'
            ]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rating badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
            <div className="w-6 h-6 bg-white/30 rounded animate-pulse"></div>
            <div className="w-8 h-4 bg-white/30 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-white/30 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Price badge skeleton */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
            <div className="w-16 h-6 bg-white/30 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Details skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-b from-transparent to-black/20">
        {/* Car name skeleton */}
        <div className="mb-2">
          <div className="w-48 h-8 bg-white/30 rounded animate-pulse mb-2"></div>
          <div className="w-16 h-5 bg-white/20 rounded animate-pulse"></div>
        </div>
        
        {/* Specs skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-white/20 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Additional specs skeleton */}
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-32 h-3 bg-white/20 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

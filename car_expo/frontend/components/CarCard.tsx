'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export interface Car {
  id: string
  name: string
  price: string
  year: number
  mileage: string
  fuelType: string
  transmission: string
  image: string
  specs: string[]
}

interface CarCardProps {
  car: Car
  onSwipeLeft: () => void
  onSwipeRight: () => void
  isTop: boolean
  stackIndex?: number
}

export default function CarCard({ car, onSwipeLeft, onSwipeRight, isTop, stackIndex = 0 }: CarCardProps) {
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)
  const x = useMotionValue(0)
  
  // Transform drag distance to rotation and opacity
  const rotate = useTransform(x, [-300, 300], [-15, 15])
  const opacity = useTransform(x, [-300, -50, 0, 50, 300], [0, 1, 1, 1, 0])
  
  // Calculate scale based on stack position
  const scale = 1 - (stackIndex * 0.05)
  const yOffset = stackIndex * 8

  return (
    <motion.div
      className={`absolute inset-0 rounded-3xl overflow-hidden ${
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isTop 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        zIndex: isTop ? 10 : 10 - stackIndex,
        scale,
        y: yOffset,
        x,
        rotate,
        opacity
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={(_, info) => {
        x.set(info.offset.x)
        if (info.offset.x > 50) {
          setDragDirection('right')
        } else if (info.offset.x < -50) {
          setDragDirection('left')
        } else {
          setDragDirection(null)
        }
      }}
      onDragEnd={(_, info) => {
        const threshold = 150
        if (info.offset.x > threshold) {
          console.log(`Liked ❤️ ${car.name}`)
          onSwipeRight()
        } else if (info.offset.x < -threshold) {
          console.log(`Skipped ❌ ${car.name}`)
          onSwipeLeft()
        } else {
          // Snap back to center
          x.set(0)
          setDragDirection(null)
        }
      }}
      whileDrag={{ 
        scale: scale * 1.05,
        zIndex: 1000,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ 
        scale, 
        opacity: 1, 
        y: yOffset,
        rotate: 0
      }}
      exit={{ 
        x: dragDirection === 'right' ? 500 : -500, 
        opacity: 0, 
        scale: 0.8,
        rotate: dragDirection === 'right' ? 15 : -15,
        transition: { duration: 0.4, ease: "easeInOut" }
      }}
    >
      {/* Car Image */}
      <div className="relative h-64 w-full">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
          <span className="text-lg font-bold text-white">{car.price}</span>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-6 bg-gradient-to-b from-transparent to-black/20">
        {/* Car Name */}
        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{car.name}</h3>
        
        {/* Year */}
        <p className="text-white/80 mb-4 text-lg">{car.year}</p>
        
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm"></div>
            <span className="text-sm text-white/90">{car.mileage}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
            <span className="text-sm text-white/90">{car.fuelType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full shadow-sm"></div>
            <span className="text-sm text-white/90">{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full shadow-sm"></div>
            <span className="text-sm text-white/90">Auto</span>
          </div>
        </div>

        {/* Additional Specs */}
        <div className="space-y-2">
          {car.specs.map((spec, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              <span className="text-sm text-white/80">{spec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Swipe Feedback Overlays */}
      {isTop && (
        <>
          {/* Like Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: useTransform(x, [50, 150], [0, 1]),
            }}
          >
            <motion.div
              className="bg-green-500/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-black text-3xl shadow-2xl border-2 border-green-400/50"
              style={{
                rotate: useTransform(x, [0, 300], [0, 10]),
                scale: useTransform(x, [0, 150], [0.8, 1.2]),
              }}
            >
              ❤️ LIKE
            </motion.div>
          </motion.div>
          
          {/* Nope Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: useTransform(x, [-150, -50], [1, 0]),
            }}
          >
            <motion.div
              className="bg-red-500/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-black text-3xl shadow-2xl border-2 border-red-400/50"
              style={{
                rotate: useTransform(x, [0, -300], [0, -10]),
                scale: useTransform(x, [0, -150], [0.8, 1.2]),
              }}
            >
              ❌ NOPE
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

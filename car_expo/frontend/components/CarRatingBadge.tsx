'use client'

import { useMemo } from 'react'
import { calculateCarRating, getRatingGrade } from '@/lib/carRating'
import { Car } from './CarCard'
import { Info } from 'lucide-react'

interface CarRatingBadgeProps {
  car: Car
}

export default function CarRatingBadge({ car }: CarRatingBadgeProps) {
  const rating = useMemo(() => calculateCarRating(car), [car])
  const grade = getRatingGrade(rating.overallScore)
  
  return (
    <div className="group relative">
      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
        <div 
          className="text-lg font-black drop-shadow-lg"
          style={{ color: grade.color }}
        >
          {grade.grade}
        </div>
        <div className="text-sm font-semibold text-white drop-shadow-lg">{rating.overallScore}</div>
        <div className="text-xs text-white/90 font-medium drop-shadow-lg">{grade.description}</div>
        <Info className="w-3 h-3 text-white/80" />
      </div>
      
      {/* Tooltip with score breakdown */}
      <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-md rounded-lg p-3 border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="text-xs text-white/90 mb-2 font-semibold">Score Breakdown:</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Value:</span>
            <span className="text-white">{rating.breakdown.value}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Reliability:</span>
            <span className="text-white">{rating.breakdown.reliability}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Features:</span>
            <span className="text-white">{rating.breakdown.features}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Condition:</span>
            <span className="text-white">{rating.breakdown.condition}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Performance:</span>
            <span className="text-white">{rating.breakdown.performance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Efficiency:</span>
            <span className="text-white">{rating.breakdown.efficiency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Style:</span>
            <span className="text-white">{rating.breakdown.style}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

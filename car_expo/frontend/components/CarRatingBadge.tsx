'use client'

import { useMemo } from 'react'
import { calculateCarRating, getRatingGrade } from '@/lib/carRating'
import { Car } from '@/components/recommender/CarCard'

interface CarRatingBadgeProps {
  car: Car
}

export default function CarRatingBadge({ car }: CarRatingBadgeProps) {
  const rating = useMemo(() => calculateCarRating(car), [car])
  const grade = getRatingGrade(rating.overallScore)
  
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
      <div 
        className="text-sm font-bold"
        style={{ color: grade.color }}
      >
        {grade.grade}
      </div>
      <div className="text-xs text-gray-300">{rating.overallScore}</div>
    </div>
  )
}

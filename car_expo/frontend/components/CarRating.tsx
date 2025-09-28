'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Star, TrendingUp, Shield, Zap, Wrench, Fuel, Palette } from 'lucide-react'
import { CarRating, getRatingGrade } from '@/lib/carRating'
import { Car } from '@/components/recommender/CarCard'

interface CarRatingProps {
  car: Car
  rating: CarRating
  compact?: boolean
}

const ratingIcons = {
  value: TrendingUp,
  reliability: Shield,
  features: Zap,
  condition: Wrench,
  performance: Star,
  efficiency: Fuel,
  style: Palette
}

const ratingLabels = {
  value: 'Value',
  reliability: 'Reliability',
  features: 'Features',
  condition: 'Condition',
  performance: 'Performance',
  efficiency: 'Efficiency',
  style: 'Style'
}

const ratingDescriptions = {
  value: 'Price vs market value and depreciation',
  reliability: 'Brand reputation, age, and mileage',
  features: 'Available options and technology',
  condition: 'Accident history and service records',
  performance: 'Engine, transmission, and drivetrain',
  efficiency: 'Fuel economy or electric range',
  style: 'Year, make/model appeal and design'
}

export default function CarRatingDisplay({ car, rating, compact = false }: CarRatingProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [selectedCategory, setSelectedCategory] = useState<keyof CarRating['breakdown'] | null>(null)

  const overallGrade = getRatingGrade(rating.overallScore)

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div 
                className="text-2xl font-bold"
                style={{ color: overallGrade.color }}
              >
                {overallGrade.grade}
              </div>
              <div className="text-xs text-gray-300">{rating.overallScore}/100</div>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Overall Rating</div>
              <div className="text-xs text-gray-300">{overallGrade.description}</div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {Object.entries(rating.breakdown).map(([key, score]) => {
                  const category = key as keyof CarRating['breakdown']
                  const grade = getRatingGrade(score)
                  const Icon = ratingIcons[category]
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-300">{ratingLabels[category]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${score}%`,
                              backgroundColor: grade.color
                            }}
                          />
                        </div>
                        <span 
                          className="text-sm font-medium w-8 text-right"
                          style={{ color: grade.color }}
                        >
                          {score}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div 
            className="text-4xl font-bold"
            style={{ color: overallGrade.color }}
          >
            {overallGrade.grade}
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{rating.overallScore}/100</div>
            <div className="text-sm text-gray-300">{overallGrade.description}</div>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ backgroundColor: overallGrade.color }}
            initial={{ width: 0 }}
            animate={{ width: `${rating.overallScore}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(rating.breakdown).map(([key, score]) => {
          const category = key as keyof CarRating['breakdown']
          const grade = getRatingGrade(score)
          const Icon = ratingIcons[category]
          const isSelected = selectedCategory === category
          
          return (
            <motion.button
              key={key}
              onClick={() => setSelectedCategory(isSelected ? null : category)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isSelected 
                  ? 'border-white/40 bg-white/10' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-gray-400" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">{ratingLabels[category]}</div>
                  <div className="text-xs text-gray-400">{ratingDescriptions[category]}</div>
                </div>
                <div className="text-right">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: grade.color }}
                  >
                    {score}
                  </div>
                  <div className="text-xs text-gray-400">{grade.grade}</div>
                </div>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${score}%`,
                    backgroundColor: grade.color
                  }}
                />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                {ratingLabels[selectedCategory]} Analysis
              </h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-green-400 mb-1">Strengths</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {rating.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-red-400 mb-1">Areas for Improvement</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {rating.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-blue-400 mb-1">Recommendations</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {rating.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Summary */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{rating.strengths.length}</div>
            <div className="text-xs text-gray-400">Strengths</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{rating.weaknesses.length}</div>
            <div className="text-xs text-gray-400">Concerns</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{rating.recommendations.length}</div>
            <div className="text-xs text-gray-400">Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact rating badge for car cards
export function CarRatingBadge({ rating }: { rating: CarRating }) {
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

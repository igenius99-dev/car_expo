'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, TrendingUp, Filter, SortAsc } from 'lucide-react'
import Link from 'next/link'
import { Car } from '@/components/recommender/CarCard'
import { calculateCarRating, getRatingGrade } from '@/lib/carRating'
import CarRatingDisplay from '@/components/CarRating'
import { cars as mockCars } from '@/lib/mock/cars'

// Mock data with additional fields for rating system
const enhancedMockCars: Car[] = mockCars.map(car => ({
  ...car,
  mileage: '25,000 miles',
  location: 'San Francisco, CA',
  dealer: 'AutoMax Dealership',
  trim: 'Base',
  exterior_color: 'White',
  interior_color: 'Black',
  engine: car.type === 'ev' ? 'Electric Motor' : '4 Cyl',
  transmission: 'Automatic',
  drivetrain: 'FWD',
  no_accidents: true,
  service_records: true,
  top_options: [
    'Leather Seats',
    'Navigation',
    'Bluetooth',
    'Backup Camera',
    'Cruise Control',
    'Air Conditioning'
  ],
  vehicle_condition: 'Used',
  dealer_rating: 4.5,
  dealer_review_count: 120,
  mpg_city: car.type === 'ev' ? undefined : '28',
  mpg_highway: car.type === 'ev' ? undefined : '35',
  fuel_type: car.type === 'ev' ? 'Electric' : 'Gasoline',
  body_style: car.type === 'suv' ? 'SUV' : car.type === 'truck' ? 'Truck' : 'Sedan',
  displacement: car.type === 'ev' ? undefined : '2.0L'
}))

type SortOption = 'overall' | 'value' | 'reliability' | 'features' | 'condition' | 'performance' | 'efficiency' | 'style'
type FilterOption = 'all' | 'sedan' | 'suv' | 'truck' | 'ev'

export default function CarRatingsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('overall')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  // Calculate ratings for all cars
  const carsWithRatings = useMemo(() => {
    return enhancedMockCars.map(car => ({
      car,
      rating: calculateCarRating(car)
    }))
  }, [])

  // Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    let filtered = carsWithRatings
    
    if (filterBy !== 'all') {
      filtered = filtered.filter(({ car }) => car.type === filterBy)
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'overall') {
        return b.rating.overallScore - a.rating.overallScore
      }
      return b.rating.breakdown[sortBy] - a.rating.breakdown[sortBy]
    })
  }, [carsWithRatings, sortBy, filterBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 size={24} className="text-blue-400" />
                <h1 className="text-2xl font-bold text-white">Car Ratings & Analysis</h1>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="sedan">Sedans</option>
                  <option value="suv">SUVs</option>
                  <option value="truck">Trucks</option>
                  <option value="ev">Electric</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <SortAsc size={16} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="overall">Overall Score</option>
                  <option value="value">Value</option>
                  <option value="reliability">Reliability</option>
                  <option value="features">Features</option>
                  <option value="condition">Condition</option>
                  <option value="performance">Performance</option>
                  <option value="efficiency">Efficiency</option>
                  <option value="style">Style</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredAndSortedCars.map(({ car, rating }, index) => {
                const grade = getRatingGrade(rating.overallScore)
                
                return (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCar(car)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedCar?.id === car.id
                        ? 'border-blue-400/50 bg-blue-500/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img 
                          src={car.image} 
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div 
                              className="text-2xl font-bold"
                              style={{ color: grade.color }}
                            >
                              {grade.grade}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-white">{rating.overallScore}/100</div>
                              <div className="text-xs text-gray-400">{grade.description}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                          <span>${car.price.toLocaleString()}</span>
                          <span>•</span>
                          <span>{car.mileage}</span>
                          <span>•</span>
                          <span className="capitalize">{car.type}</span>
                        </div>
                        
                        {/* Quick breakdown */}
                        <div className="mt-3 flex gap-4">
                          {Object.entries(rating.breakdown).slice(0, 4).map(([key, score]) => {
                            const categoryGrade = getRatingGrade(score)
                            return (
                              <div key={key} className="text-center">
                                <div 
                                  className="text-xs font-medium"
                                  style={{ color: categoryGrade.color }}
                                >
                                  {score}
                                </div>
                                <div className="text-xs text-gray-400 capitalize">{key}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Detailed Rating Panel */}
          <div className="lg:col-span-1">
            {selectedCar ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CarRatingDisplay 
                  car={selectedCar} 
                  rating={calculateCarRating(selectedCar)}
                  compact={false}
                />
              </motion.div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Select a Car</h3>
                <p className="text-gray-400">
                  Click on any car from the list to see detailed ratings and analysis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {filteredAndSortedCars.length}
            </div>
            <div className="text-gray-400">Cars Analyzed</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {Math.round(filteredAndSortedCars.reduce((acc, { rating }) => acc + rating.overallScore, 0) / filteredAndSortedCars.length)}
            </div>
            <div className="text-gray-400">Average Score</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {filteredAndSortedCars.filter(({ rating }) => rating.overallScore >= 80).length}
            </div>
            <div className="text-gray-400">High Rated (A- or better)</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              ${Math.round(filteredAndSortedCars.reduce((acc, { car }) => acc + car.price, 0) / filteredAndSortedCars.length).toLocaleString()}
            </div>
            <div className="text-gray-400">Average Price</div>
          </div>
        </div>
      </div>
    </div>
  )
}

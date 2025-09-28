'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CarCard, { Car } from './CarCard'

// Mock car data
const mockCars: Car[] = [
  {
    id: '1',
    name: 'BMW M4 Competition',
    price: '$75,000',
    year: 2023,
    mileage: '12,000 mi',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
    specs: ['V8 Twin Turbo', '503 HP', '0-60 in 3.8s', 'Carbon Fiber']
  },
  {
    id: '2',
    name: 'Tesla Model S Plaid',
    price: '$89,990',
    year: 2024,
    mileage: '8,500 mi',
    fuelType: 'Electric',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=300&fit=crop',
    specs: ['1,020 HP', '0-60 in 1.99s', '390 mi range', 'Autopilot']
  },
  {
    id: '3',
    name: 'Porsche 911 Turbo S',
    price: '$203,500',
    year: 2023,
    mileage: '5,200 mi',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop',
    specs: ['640 HP', '0-60 in 2.6s', 'AWD', 'Carbon Ceramic Brakes']
  },
  {
    id: '4',
    name: 'Audi RS6 Avant',
    price: '$109,000',
    year: 2023,
    mileage: '15,000 mi',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop',
    specs: ['591 HP', '0-60 in 3.6s', 'Wagon', 'Quattro AWD']
  },
  {
    id: '5',
    name: 'Mercedes-AMG GT 63 S',
    price: '$156,000',
    year: 2023,
    mileage: '9,800 mi',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop',
    specs: ['630 HP', '0-60 in 3.1s', '4-Door Coupe', 'AMG Performance']
  },
  {
    id: '6',
    name: 'Lamborghini Huracán',
    price: '$208,571',
    year: 2022,
    mileage: '3,500 mi',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop',
    specs: ['602 HP', '0-60 in 3.2s', 'V10 Engine', 'Carbon Fiber']
  }
]

export default function SwipeDeck() {
  const [cars, setCars] = useState<Car[]>(mockCars)
  const [favorites, setFavorites] = useState<Car[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwipeLeft = () => {
    setCurrentIndex(prev => prev + 1)
  }

  const handleSwipeRight = () => {
    const currentCar = cars[currentIndex]
    if (currentCar) {
      setFavorites(prev => [...prev, currentCar])
    }
    setCurrentIndex(prev => prev + 1)
  }

  const resetDeck = () => {
    setCars(mockCars)
    setCurrentIndex(0)
    setFavorites([])
  }

  // Show completion message when deck is empty
  if (currentIndex >= cars.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">All Done!</h2>
        <p className="text-gray-600 mb-6">
          You've swiped through all {cars.length} cars
        </p>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Your Favorites ({favorites.length}):
          </p>
          <div className="space-y-1">
            {favorites.map((car, index) => (
              <p key={index} className="text-sm text-gray-600">
                {car.name} - {car.price}
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={resetDeck}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main Container with Cards and Background */}
      <div className="relative h-[600px] mb-8">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Stack of cards */}
        <AnimatePresence mode="wait">
          {cars.slice(currentIndex, currentIndex + 3).map((car, index) => (
            <CarCard
              key={car.id}
              car={car}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTop={index === 0}
              stackIndex={index}
            />
          ))}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-20">
          <span className="text-sm font-medium text-white">
            {currentIndex + 1} / {cars.length}
          </span>
        </div>

        {/* Favorites Counter */}
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-20">
          <span className="text-sm font-medium text-white">
            ❤️ {favorites.length}
          </span>
        </div>
      </div>

      {/* Action Buttons - Positioned below cards */}
      <div className="flex justify-center items-center space-x-8 z-30 relative">
        {/* Nope Button */}
        <motion.button
          onClick={handleSwipeLeft}
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 20px rgba(239, 68, 68, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(239, 68, 68, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="text-red-400 drop-shadow-lg">❌</span>
        </motion.button>

        {/* Rewind Button */}
        <motion.button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(prev => prev - 1)
            }
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl relative overflow-hidden ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(59, 130, 246, 0.6)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 20px rgba(59, 130, 246, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
          whileHover={currentIndex > 0 ? { 
            scale: 1.1,
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(59, 130, 246, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          } : {}}
          whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          disabled={currentIndex === 0}
        >
          <span className="text-blue-400 drop-shadow-lg">🔙</span>
        </motion.button>

        {/* Like Button */}
        <motion.button
          onClick={handleSwipeRight}
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative overflow-hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(34, 197, 94, 0.6)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 20px rgba(34, 197, 94, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(34, 197, 94, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="text-green-400 drop-shadow-lg">❤️</span>
        </motion.button>
      </div>
    </div>
  )
}

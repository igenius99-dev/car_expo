"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import {
  FaGasPump,
  FaBolt,
  FaCogs,
  FaTachometerAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"
import { Car } from "./CarCard.types" // <-- optional, if you have types separated

interface CarCardProps {
  car: Car
  onSwipe: (direction: "left" | "right") => void
  onSave: (id: string) => void
  saved: boolean
  interactive?: boolean
  isTop?: boolean
  stackIndex?: number
  isPreview?: boolean
  previewSide?: "left" | "right"
}

export default function CarCard({
  car,
  onSwipe,
  onSave,
  saved,
  interactive = true,
  isTop = true,
  stackIndex = 0,
  isPreview = false,
}: CarCardProps) {
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-15, 15])
  const opacity = useTransform(x, [-300, -50, 0, 50, 300], [0, 1, 1, 1, 0])

  const scale = isPreview ? 1 : 1 - stackIndex * 0.05
  const yOffset = isPreview ? 0 : stackIndex * 8

  return (
    <motion.div
      className={`absolute inset-0 rounded-3xl overflow-hidden ${isTop && interactive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
        }`}
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: isTop
          ? "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15)"
          : "0 10px 25px -5px rgba(0,0,0,0.2)",
        zIndex: isTop ? 10 : 10 - stackIndex,
        scale,
        y: yOffset,
        x: isPreview ? 0 : x,
        rotate: isPreview ? 0 : rotate,
        opacity: isPreview ? 0.6 : opacity,
      }}
      drag={isTop && interactive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      onDrag={(_, info) => {
        x.set(info.offset.x)
        setDragDirection(info.offset.x > 50 ? "right" : info.offset.x < -50 ? "left" : null)
      }}
      onDragEnd={(_, info) => {
        const threshold = 150
        if (info.offset.x > threshold) {
          onSwipe("right")
        } else if (info.offset.x < -threshold) {
          onSwipe("left")
        } else {
          x.set(0)
          setDragDirection(null)
        }
      }}
      whileDrag={{
        scale: scale * 1.05,
        zIndex: 1000,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale, opacity: 1, y: yOffset, rotate: 0 }}
      exit={{
        x: dragDirection === "right" ? 500 : -500,
        opacity: 0,
        scale: 0.8,
        rotate: dragDirection === "right" ? 15 : -15,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      {/* Image */}
      {/* Image */}
      <div className="relative h-80 w-full">
        <Image
          src={car.image}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-5 right-5 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-200 shadow-lg">
          <span className="text-xl font-bold text-gray-900">
            ${car.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-7 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {car.make} {car.model}
          </h3>
          <p className="text-gray-600">{car.year}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-5">
          {car.mileage && (
            <div className="flex items-center space-x-3 text-gray-700">
              <FaTachometerAlt className="text-blue-500 text-lg" />
              <span className="text-base">{car.mileage}</span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center space-x-3 text-gray-700">
              {car.fuel_type.toLowerCase().includes("electric") ? (
                <FaBolt className="text-green-500 text-lg" />
              ) : (
                <FaGasPump className="text-green-500 text-lg" />
              )}
              <span className="text-base">{car.fuel_type}</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center space-x-3 text-gray-700">
              <FaCogs className="text-purple-500 text-lg" />
              <span className="text-base">{car.transmission}</span>
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3">
          {(car.top_options || []).map((spec, i) => (
            <span
              key={i}
              className="px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 
                   text-sm font-medium text-gray-800 text-center shadow-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>


      {/* Overlays */}
      {isTop && (
        <>
          {/* Like */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
          >
            <motion.div
              className="flex items-center gap-2 bg-green-500/90 px-8 py-4 rounded-2xl font-black text-3xl text-white shadow-2xl border-2 border-green-400"
              style={{
                rotate: useTransform(x, [0, 300], [0, 10]),
                scale: useTransform(x, [0, 150], [0.8, 1.2]),
              }}
            >
              <FaCheckCircle /> LIKE
            </motion.div>
          </motion.div>

          {/* Nope */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
          >
            <motion.div
              className="flex items-center gap-2 bg-red-500/90 px-8 py-4 rounded-2xl font-black text-3xl text-white shadow-2xl border-2 border-red-400"
              style={{
                rotate: useTransform(x, [0, -300], [0, -10]),
                scale: useTransform(x, [0, -150], [0.8, 1.2]),
              }}
            >
              <FaTimesCircle /> NOPE
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

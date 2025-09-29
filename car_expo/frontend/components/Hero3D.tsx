'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Environment, 
  PerspectiveCamera, 
  useGLTF, 
  Text, 
  Float,
  Sparkles,
  useTexture
} from '@react-three/drei'
import { Group, Mesh, Vector3 } from 'three'
import * as THREE from 'three'

// Hook to track scroll
function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return scrollY
}

// BMW M4 Competition Model Component
function BMWModel({ 
  headlightsFlickering, 
  headlightsOn, 
  carVisible, 
  engineStarted,
  scrollY = 0
}: {
  headlightsFlickering: boolean
  headlightsOn: boolean
  carVisible: boolean
  engineStarted: boolean
  scrollY?: number
}) {
  const { scene } = useGLTF('/models/2021_bmw_m4_competition.glb')
  const groupRef = useRef<Group>(null)

  // No local state management - controlled by parent component

  // Animation loop - scroll-based car movement + idle vibration
  useFrame((state) => {
    if (groupRef.current) {
      // Scroll-based car Z position: move backward when scrolling down
      const baseZ = 0
      const maxOffset = 3
      const offset = Math.min(scrollY / 300, maxOffset)
      
      // Smooth interpolate car Z position
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        baseZ + offset,
        0.05
      )
      
      // Subtle idle vibration when engine is started
      if (engineStarted) {
        const time = state.clock.getElapsedTime()
        groupRef.current.position.y = Math.sin(time * 3) * 0.0005 // Very minimal
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <primitive object={scene} />
    </group>
  )
}

// Subtle smoke/fog particles component
function SmokeParticles({ engineStarted }: { engineStarted: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 30 // Reduced for subtlety
  
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  
  // Initialize particle positions and velocities - more controlled
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.3 // x - tighter spread
    positions[i * 3 + 1] = -0.3 // y (start low)
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2 // z - tighter spread
    
    velocities[i * 3] = (Math.random() - 0.5) * 0.005 // x velocity - slower
    velocities[i * 3 + 1] = Math.random() * 0.01 + 0.005 // y velocity - slower upward
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005 // z velocity - slower
  }
  
  useFrame((state) => {
    if (pointsRef.current && engineStarted) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < particleCount; i++) {
        // Update positions
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]
        
        // Reset particles that have risen too high
        if (positions[i * 3 + 1] > 1.5) {
          positions[i * 3] = (Math.random() - 0.5) * 0.3
          positions[i * 3 + 1] = -0.3
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  if (!engineStarted) return null
  
  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#888888" 
        size={0.08} 
        transparent 
        opacity={0.3} // Lower opacity for subtlety
        sizeAttenuation
      />
    </points>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  )
}

// Animated Camera Component
function AnimatedCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [cameraZoom, setCameraZoom] = useState(false)
  
  useEffect(() => {
    // Start camera zoom immediately for testing
    setCameraZoom(true)
    
    // Original timing (commented out for testing)
    // const timer = setTimeout(() => {
    //   setCameraZoom(true)
    // }, 2500)
    
    // return () => clearTimeout(timer)
  }, [])

  useFrame((state) => {
    if (cameraRef.current) {
      if (cameraZoom) {
        // Smooth camera zoom from z=10 to z=5
        const targetZ = 5
        const currentZ = cameraRef.current.position.z
        const lerpFactor = 0.02 // Smooth easing
        
        cameraRef.current.position.z = THREE.MathUtils.lerp(currentZ, targetZ, lerpFactor)
      }
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1, 10]} // Start further back
      fov={50}
      near={0.1}
      far={1000}
    />
  )
}

// Main Hero3D Component
export default function Hero3D() {
  // Animation states
  const [headlightsFlickering, setHeadlightsFlickering] = useState(false)
  const [headlightsOn, setHeadlightsOn] = useState(false)
  const [carVisible, setCarVisible] = useState(false)
  const [engineStarted, setEngineStarted] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  
  // Track scroll position
  const scrollY = useScrollY()
  
  // Cinematic timing sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    // 0s: Initial state - car far back, headlights visible, no text
    // (already set by default states)
    
    // 1s: Headlights start flickering
    timers.push(setTimeout(() => {
      setEngineStarted(true)
      setHeadlightsFlickering(true)
    }, 1000))
    
    // 1.5s: Headlights stop flickering and turn on steady
    timers.push(setTimeout(() => {
      setHeadlightsFlickering(false)
      setHeadlightsOn(true)
    }, 1500))
    
    // 2s: Car starts moving closer (car body fade-in starts)
    timers.push(setTimeout(() => {
      setCarVisible(true)
    }, 2000))
    
    // 2.5s: Text fades in after headlights are fully on (1.5s + 1s delay)
    timers.push(setTimeout(() => {
      setTextVisible(true)
    }, 2500))
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Animated Camera */}
        <AnimatedCamera />
        
        {/* Lighting - more controlled and cinematic */}
        <ambientLight intensity={0.05} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[0, 5, 5]}
          angle={0.2}
          penumbra={0.8}
          intensity={0.8}
          castShadow
        />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* BMW Model */}
        <Suspense fallback={<LoadingFallback />}>
          <BMWModel 
            headlightsFlickering={headlightsFlickering}
            headlightsOn={headlightsOn}
            carVisible={carVisible}
            engineStarted={engineStarted}
            scrollY={scrollY}
          />
        </Suspense>
        
        {/* Subtle Smoke Particles */}
        <SmokeParticles engineStarted={engineStarted} />
        
        {/* Minimal atmospheric particles */}
        <Sparkles count={50} scale={15} size={1} speed={0.3} />
      </Canvas>
      
      {/* Overlay Content - Fades in after headlights are fully on */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        
        <div className="text-center text-white z-10 pointer-events-auto relative">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
            Find your dream ride.
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            AutoMatch — swipe, save, drive.
          </p>
          
          {/* CTA Button */}
          <button 
            className="bg-white hover:bg-[#f0f0f0] text-black font-semibold py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            onClick={() => {
              // Open search overlay (same as Cmd + \)
              window.dispatchEvent(new Event("open-search"));
            }}
          >
            Open Search
          </button>
        </div>
      </div>
      
    </div>
  )
}

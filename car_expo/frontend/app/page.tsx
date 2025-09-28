"use client";
import { Button } from "@/components/ui/button";
// import Recommender from "@/components/recommender/Recommender";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Car, Heart, Search } from "lucide-react";
import Hero3D from "@/components/Hero3D";
import SwipeDeck from "@/components/SwipeDeck";
import NightSky from "@/components/ShootingStars";

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Night Sky Background */}
      <NightSky />
      
      {/* 3D Hero Section */}
      <Hero3D />

      {/* About AutoMatch Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Car Swipe Deck */}
      <section id="swipe" className="w-full py-12 md:py-16 relative z-10">
        <div className="text-center mb-8 px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Swipe Your Dream Car</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Swipe right to save your favorites, left to skip. Find the perfect car for you!
          </p>
        </div>
        <SwipeDeck />
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

// About AutoMatch Section
function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-20 md:py-32 relative z-10 bg-gradient-to-br from-black via-gray-900 to-purple-900/20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            What is AutoMatch?
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 font-medium">
            Your personal car discovery assistant.
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            AutoMatch helps you find your dream ride with a fun and intuitive swiping experience. 
            Browse through thousands of cars, save your favorites, and let the perfect match come to you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Car,
      title: "Swipe to decide",
      desc: "Intuitive left/right gestures with smooth animations."
    },
    {
      icon: Heart,
      title: "Favorites that stick",
      desc: "Save cars locally to revisit anytime."
    },
    {
      icon: Search,
      title: "Quick search",
      desc: "Global search overlay with keyboard shortcut."
    }
  ];

  return (
    <section className="w-full py-20 md:py-32 relative z-10 bg-black/30">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Features
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Everything you need to find your perfect car
          </p>
        </motion.div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: "easeOut" 
              }}
            >
              <FeatureCard IconComponent={feature.icon} title={feature.title} desc={feature.desc} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Section
function FooterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer className="w-full py-16 relative z-10 bg-gradient-to-br from-black via-gray-900 to-gray-800 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          {/* Left side - Logo & Tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">AutoMatch</h3>
            <p className="text-gray-300">Swipe. Save. Drive.</p>
          </div>

          {/* Right side - Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors relative group"
            >
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-8 pt-8 border-t border-gray-800"
        >
          <p className="text-gray-400 text-sm">
            © 2025 AutoMatch. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function FeatureCard({ IconComponent, title, desc }: { IconComponent: any; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-[#111]/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-300 group">
      {/* Circular Icon Badge */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-300">
          <IconComponent className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        </div>
      </div>
      
      {/* Title */}
      <div className="text-xl font-semibold text-white mb-4 text-center group-hover:text-blue-100 transition-colors duration-300">
        {title}
      </div>
      
      {/* Description */}
      <p className="text-gray-300 leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
        {desc}
      </p>
    </div>
  );
}
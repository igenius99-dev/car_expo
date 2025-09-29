"use client";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Car, Heart, Search, ArrowRight, ChevronRight } from "lucide-react";
import Hero3D from "@/components/Hero3D";
import NightSky from "@/components/ShootingStars";

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Night Sky Background */}
      <NightSky />
      
      {/* 3D Hero Section */}
      <Hero3D />

      {/* Bold Statement Section */}
      <BoldStatementSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Reality Check Section */}
      <RealitySection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

// Bold Statement Section - Cluely Style
function BoldStatementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-32 relative z-10 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.9]">
            Car shopping
            <br />
            <span className="text-gray-500">is broken.</span>
          </h2>
          
          <div className="mt-16 space-y-8">
            <div className="text-2xl md:text-3xl text-gray-400 font-light">
              <span className="text-white font-semibold">87%</span> of people hate dealerships
            </div>
            <div className="text-2xl md:text-3xl text-gray-400 font-light">
              <span className="text-white font-semibold">6 months</span> average search time
            </div>
            <div className="text-2xl md:text-3xl text-gray-400 font-light">
              <span className="text-white font-semibold">23 sites</span> visited before buying
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
              We fixed it. One prompt. Perfect matches. Zero BS.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Problem Section - No emojis, cleaner design
function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      number: "01",
      title: "Endless scrolling",
      description: "through the same recycled listings"
    },
    {
      number: "02",
      title: "Sketchy dealers",
      description: "with their 'best price' lies"
    },
    {
      number: "03",
      title: "Missing the good ones",
      description: "while you sleep"
    }
  ];

  return (
    <section className="w-full py-32 relative z-10 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              You waste <span className="text-white">47 hours</span> per search
            </h2>
            <p className="text-xl text-gray-400 mt-4">Here's what you're doing wrong:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-l-2 border-gray-800 pl-6 hover:border-white transition-colors duration-300"
              >
                <div className="text-gray-600 text-sm font-mono mb-2">{problem.number}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-gray-400 text-lg">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// How It Works - Clean, bold blocks
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      step: "Step 1",
      title: "Type what you want",
      example: '"Reliable SUV under $30k with low miles"',
      result: "AI finds perfect matches from 50+ sources"
    },
    {
      step: "Step 2", 
      title: "AI ranks everything",
      example: "Reliability • Price • Condition • Location",
      result: "No more comparing 20 tabs"
    },
    {
      step: "Step 3",
      title: "Swipe to decide",
      example: "Left to pass, right to save",
      result: "Your perfect car in minutes, not months"
    }
  ];

  return (
    <section className="w-full py-32 relative z-10 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              It's <span className="text-white">stupid simple</span>
            </h2>
            <p className="text-xl text-gray-400">30 seconds to your dream car</p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-black border border-gray-800 rounded-lg p-8 md:p-12 hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="text-gray-600 text-sm font-mono mb-2">{step.step}</div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-500 mb-4 font-mono text-sm">{step.example}</p>
                    <div className="flex items-center gap-2 text-green-400 text-lg">
                      <ChevronRight className="w-5 h-5" />
                      <span>{step.result}</span>
                    </div>
                  </div>
                  <div className="text-8xl md:text-9xl font-bold text-gray-900">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Reality Check Section - Honest messaging
function RealitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-32 relative z-10 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
            Real talk
          </h2>

          <div className="space-y-12 text-left max-w-4xl mx-auto">
            <div className="border-l-4 border-white pl-8">
              <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
                We just launched. We're scraping data from everywhere. 
                The AI is learning. It's not perfect yet.
              </p>
            </div>

            <div className="border-l-4 border-gray-600 pl-8">
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                But it's already better than spending your weekends 
                on Craigslist and Autotrader.
              </p>
            </div>

            <div className="border-l-4 border-gray-800 pl-8">
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                Every swipe makes it smarter. Be part of fixing 
                the broken car shopping experience.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20"
          >
            <div className="inline-flex items-center gap-4 text-gray-400">
              <span className="text-2xl font-bold text-white">100+</span>
              <span className="text-lg">early users swiping daily</span>
              <span className="text-gray-600">|</span>
              <span className="text-2xl font-bold text-white">5,000+</span>
              <span className="text-lg">cars analyzed so far</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-32 relative z-10 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Stop wasting time
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Your perfect car is <span className="text-white font-bold">3 swipes away</span>
          </p>
          
          <Button 
            className="bg-white hover:bg-gray-100 text-black text-xl px-12 py-8 rounded-full font-semibold group transition-all duration-300 hover:scale-105"
            onClick={() => {
              // Open search overlay (same as Cmd + \)
              window.dispatchEvent(new Event("open-search"));
            }}
          >
            Start Swiping
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>

          <p className="text-gray-500 mt-8 text-sm">
            No signup required • 100% free • Works instantly
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer Section - Keep the existing one
function FooterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer className="w-full py-16 relative z-10 bg-black border-t border-gray-900">
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
            <p className="text-gray-400">The dating app for cars.</p>
          </div>

          {/* Right side - Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="#how" className="text-gray-400 hover:text-white transition-colors">
              How it Works
            </a>
            <a href="/ratings" className="text-gray-400 hover:text-white transition-colors">
              Car Ratings
            </a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-8 pt-8 border-t border-gray-900"
        >
          <p className="text-gray-500 text-sm">
            © 2025 AutoMatch. Made with ❤️ for car lovers who hate dealerships.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
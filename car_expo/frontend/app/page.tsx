"use client";
import { Button } from "@/components/ui/button";
// import Recommender from "@/components/recommender/Recommender";
import { motion } from "framer-motion";
import Hero3D from "@/components/Hero3D";
import SwipeDeck from "@/components/SwipeDeck";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 3D Hero Section */}
      <Hero3D />

      {/* Car Swipe Deck */}
      <section id="swipe" className="container mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Swipe Your Dream Car</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Swipe right to save your favorites, left to skip. Find the perfect car for you!
          </p>
        </div>
        <SwipeDeck />
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard title="Swipe to decide" desc="Intuitive left/right gestures with smooth animations and keyboard buttons." />
          <FeatureCard title="Favorites that stick" desc="Your saved cars persist locally so they're there when you come back." />
          <FeatureCard title="Quick search" desc="Global search overlay with blur background, open via Cmd+\\ or Ctrl+\\." />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-lg font-medium">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
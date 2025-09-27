"use client";
import { Button } from "@/components/ui/button";
// import Recommender from "@/components/recommender/Recommender";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_50%_0%,_oklch(0.97_0_0),_transparent)] dark:bg-[radial-gradient(40%_50%_at_50%_0%,_oklch(0.269_0_0),_transparent)]" />
        <div className="container mx-auto px-6 py-20 md:py-28">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-4xl md:text-6xl font-semibold tracking-tight">
            Find your next car in a swipe
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="mt-4 max-w-2xl text-muted-foreground text-lg">
            A playful, Tinder-like interface to discover, save, and compare cars. Press Cmd+\\ to start with a natural language prompt.
          </motion.p>
          <div className="mt-8 flex gap-3">
            {/* The flow is search-first via Cmd+\, so we keep a single features CTA */}
            <Button variant="outline" asChild>
              <a href="#features">See features</a>
            </Button>
          </div>
        </div>
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
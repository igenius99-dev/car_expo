"use client";
import { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/recommendations?q=${encodeURIComponent(q)}`);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Cinematic gradient + blur backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,_oklch(0.3_0.2_300_/_40%)_0%,_transparent_60%),_linear-gradient(to_bottom,oklch(0.12_0_0/_70%),oklch(0.12_0_0/_70%))] backdrop-blur-xl" onClick={() => onOpenChange(false)} />

      {/* Glass panel */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mx-auto mt-24 max-w-2xl rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 text-card-foreground shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit} className="flex items-center gap-2 p-3 border-b border-white/10">
          <motion.div
            animate={focused ? { boxShadow: "0 0 0 6px rgba(99,102,241,0.15)" } : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="flex-1 rounded-xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Describe your ideal car… e.g. 'SUV under $20k, <100k miles'"
              className="w-full bg-transparent outline-none px-4 py-3 text-base placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
            />
          </motion.div>
          <Button type="submit" size="sm" className="gap-1">
            <Sparkles className="size-4" />
            Search
          </Button>
          <Button variant="ghost" size="icon" aria-label="Close search" onClick={() => onOpenChange(false)}>
            <X className="size-5" />
          </Button>
        </form>

        <div className="p-4 text-sm text-muted-foreground">
          <div className="mb-2 font-medium text-foreground">Try prompts</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li>
              <button type="button" onClick={() => setQuery("Popular SUVs under $25k")} className="w-full text-left rounded-lg border border-white/10 p-3 bg-white/5 hover:bg-white/10 transition">Popular SUVs under $25k</button>
            </li>
            <li>
              <button type="button" onClick={() => setQuery("Electric cars with 250+ mi range")} className="w-full text-left rounded-lg border border-white/10 p-3 bg-white/5 hover:bg-white/10 transition">Electric cars with 250+ mi range</button>
            </li>
            <li>
              <button type="button" onClick={() => setQuery("Sedans under $20k low mileage")} className="w-full text-left rounded-lg border border-white/10 p-3 bg-white/5 hover:bg-white/10 transition">Sedans under $20k • low mileage</button>
            </li>
            <li>
              <button type="button" onClick={() => setQuery("Pickup trucks below $30k")} className="w-full text-left rounded-lg border border-white/10 p-3 bg-white/5 hover:bg-white/10 transition">Pickup trucks below $30k</button>
            </li>
          </ul>
          <p className="mt-4">Tip: Press Cmd+\\ (Mac) or Ctrl+\\ (Win) to toggle search.</p>
        </div>
      </motion.div>
    </div>
  );
}
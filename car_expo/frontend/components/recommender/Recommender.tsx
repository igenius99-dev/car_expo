"use client";
import { useMemo, useState, useEffect } from "react";
import CarCard from "./CarCard";
import { Button } from "@/components/ui/button";
import { X, Heart, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cars as mock } from "@/lib/mock/cars";

export default function Recommender({ query = "" }: { query?: string }) {
  const [index, setIndex] = useState(0);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);
  const [filter, setFilter] = useState<string>("all");

  const parsed = useMemo(() => parseQuery(query), [query]);

  const cars = useMemo(() => {
    let list = mock;
    // User filter select (optional)
    if (filter !== "all") list = list.filter((c) => c.type === filter);
    // Query parsing filters
    if (parsed.type) list = list.filter((c) => c.type.toLowerCase() === parsed.type);
    if (parsed.maxPrice) list = list.filter((c) => c.price <= parsed.maxPrice!);
    return list;
  }, [filter, parsed]);

  // Reset deck index when filters or parsed query change to avoid out-of-range
  useEffect(() => {
    setIndex(0);
  }, [filter, parsed.type, parsed.maxPrice]);

  const hasCars = cars.length > 0;
  const safeLen = Math.max(cars.length, 1);

  const current = hasCars ? cars[index % safeLen] : undefined;
  const next1 = hasCars ? cars[(index + 1) % safeLen] : undefined;
  const next2 = hasCars ? cars[(index + 2) % safeLen] : undefined;

  const handleSwipe = (dir: "left" | "right") => {
    if (dir === "right" && current) toggleSave(current.id);
    setIndex((i) => (hasCars ? (i + 1) % safeLen : 0));
  };

  const toggleSave = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const savedCars = useMemo(() => mock.filter((c) => favorites.includes(c.id)), [favorites]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Discover your next car</h2>
          <p className="text-muted-foreground">Swipe right to save, left to skip. Use Cmd+\\ to refine your query.</p>
          <p className="text-xs text-muted-foreground" aria-live="polite">{hasCars ? `${cars.length} result${cars.length === 1 ? "" : "s"} found` : "No results"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40" aria-label="Filter by type"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="ev">EV</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIndex(0)} aria-label="Restart deck"><RotateCcw className="mr-2 size-4"/>Restart</Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative h-[560px] w-full flex items-center justify-center" role="region" aria-label="Recommendation deck">
          {/* Cinematic glow background for deck */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(35%_40%_at_50%_30%,_oklch(0.3_0.2_300/_25%)_0%,_transparent_70%)]" />

          {/* Stacked deck: next2 (back), next1 (middle), current (front) */}
          <AnimatePresence initial={false}>
            {next2 && (
              <motion.div
                key={`peek-2-${next2.id}`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 0.6, y: 14, scale: 0.94 }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
                className="absolute"
                aria-hidden
              >
                <CarCard car={next2} onSwipe={() => {}} onSave={() => {}} saved={false} interactive={false} />
              </motion.div>
            )}
            {next1 && (
              <motion.div
                key={`peek-1-${next1.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 0.8, y: 8, scale: 0.97 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 150, damping: 18 }}
                className="absolute"
                aria-hidden
              >
                <CarCard car={next1} onSwipe={() => {}} onSave={() => {}} saved={false} interactive={false} />
              </motion.div>
            )}
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 210, damping: 22 }}
                className="absolute"
              >
                <CarCard car={current} onSwipe={handleSwipe} onSave={toggleSave} saved={favorites.includes(current.id)} />
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="mb-3">No cars found for your filters.</div>
                <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new Event("open-search"))}>
                  Refine search (Cmd+\\)
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <Button size="lg" variant="destructive" onClick={() => handleSwipe("left")} aria-label="Skip car" disabled={!hasCars}><X className="mr-2"/>Skip</Button>
          <Button size="lg" onClick={() => handleSwipe("right")} aria-label="Save car" disabled={!hasCars}><Heart className="mr-2"/>Save</Button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Saved favorites</h3>
        {savedCars.length === 0 ? (
          <p className="text-muted-foreground">You haven't saved any cars yet. Swipe right to save favorites.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCars.map((c) => (
              <div key={c.id} className="rounded-xl overflow-hidden border border-border/60 bg-white/5 backdrop-blur-xl">
                <div className="relative aspect-video">
                  <img src={c.image} alt={`${c.make} ${c.model}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.year} {c.make} {c.model}</div>
                    <div className="text-xs text-muted-foreground">${c.price.toLocaleString()} • {c.type.toUpperCase()}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleSave(c.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function parseQuery(q: string): { type?: string; maxPrice?: number } {
  const lower = q.toLowerCase();
  let type: string | undefined;
  if (/\bev\b|electric/.test(lower)) type = "ev";
  else if (/suv/.test(lower)) type = "suv";
  else if (/sedan/.test(lower)) type = "sedan";
  else if (/truck/.test(lower)) type = "truck";

  let maxPrice: number | undefined;
  const underMatch = lower.match(/(?:under|below|<|<=|max)\s*\$?\s*(\d+)(?:\s*(k|k\b))?/);
  if (underMatch) {
    const num = parseInt(underMatch[1], 10);
    const isK = Boolean(underMatch[2]);
    maxPrice = isK ? num * 1000 : num;
  } else {
    // e.g. "$20k" present without "under"
    const dollar = lower.match(/\$\s*(\d+)\s*(k|k\b)?/);
    if (dollar) {
      const num = parseInt(dollar[1], 10);
      const isK = Boolean(dollar[2]);
      maxPrice = isK ? num * 1000 : num;
    }
  }

  return { type, maxPrice };
}
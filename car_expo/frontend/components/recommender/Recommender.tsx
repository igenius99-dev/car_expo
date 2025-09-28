"use client";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cars as mock } from "@/lib/mock/cars";
import CarCard, { Car } from "./CarCard";
import { calculateCarRating } from "@/lib/carRating";
import CarRatingBadge from "@/components/CarRatingBadge";

export default function Recommender({ query = "" }: { query?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);
  const [filter, setFilter] = useState<string>("all");

  const [openaiData, setOpenaiData] = useState<any>(null);
  const [isLoadingOpenai, setIsLoadingOpenai] = useState(false);
  const [scraperResults, setScraperResults] = useState<any>(null);

  const parsed = useMemo(() => {
    const result = parseQuery(query);
    console.log('Query:', query, 'Parsed:', result);
    return result;
  }, [query]);

  // Call OpenAI API when query changes
  useEffect(() => {
    if (query && query.trim()) {
      setIsLoadingOpenai(true);
      
      fetch('/api/parse-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('OpenAI API Response:', data);
        setOpenaiData(data);
        setScraperResults(data.scraperResults);
        setIsLoadingOpenai(false);
      })
      .catch(error => {
        console.error('Error calling OpenAI API:', error);
        setIsLoadingOpenai(false);
      });
    } else {
      setOpenaiData(null);
    }
  }, [query]);

  // Convert scraper results to the format expected by the UI
  const convertedCars = useMemo(() => {
    if (!scraperResults?.success || !scraperResults.results) {
      return [];
    }
    
    return scraperResults.results.map((car: any, index: number) => ({
      id: car.vin || `car-${index}`,
      make: car.make,
      model: car.model,
      year: parseInt(car.year) || 2023,
      price: parseInt(car.price?.replace(/[$,]/g, '') || '0'),
      image: car.image_url || 'https://images.unsplash.com/photo-1549921296-3ecf9c4a9254?auto=format&fit=crop&w=1400&q=60',
      type: car.body_style?.toLowerCase() || 'sedan',
      mileage: car.mileage,
      location: car.location,
      dealer: car.dealer,
      trim: car.trim,
      exterior_color: car.exterior_color,
      interior_color: car.interior_color,
      engine: car.engine,
      transmission: car.transmission,
      drivetrain: car.drivetrain,
      no_accidents: car.no_accidents,
      service_records: car.service_records,
      listing_url: car.listing_url,
      monthly_payment: car.monthly_payment
    }));
  }, [scraperResults]);

  const cars = useMemo(() => {
    let list = convertedCars.length > 0 ? convertedCars : mock;
    console.log('Initial list length:', list.length);
    
    // User filter select (optional)
    if (filter !== "all") {
      list = list.filter((c) => c.type === filter);
      console.log('After filter:', list.length);
    }
    // Query parsing filters
    if (parsed.type) {
      list = list.filter((c) => c.type.toLowerCase() === parsed.type);
      console.log('After type filter:', list.length);
    }
    if (parsed.maxPrice) {
      list = list.filter((c) => c.price <= parsed.maxPrice!);
      console.log('After price filter:', list.length);
    }
    
    // Sort by rating score (highest rated first)
    list = list.sort((a, b) => {
      const ratingA = calculateCarRating(a);
      const ratingB = calculateCarRating(b);
      return ratingB.overallScore - ratingA.overallScore;
    });
    
    console.log('Final cars (sorted by rating):', list.length);
    return list;
  }, [filter, parsed, convertedCars]);

  // Reset deck index when filters or parsed query change to avoid out-of-range
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter, parsed.type, parsed.maxPrice]);

  const hasCars = cars.length > 0;

  const handleSwipeLeft = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = () => {
    const currentCar = cars[currentIndex];
    if (currentCar) {
      setFavorites(prev => [...prev, currentCar.id]);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const toggleSave = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const savedCars = useMemo(() => cars.filter((c) => favorites.includes(c.id)), [favorites, cars]);

  const resetDeck = () => {
    setCurrentIndex(0);
  };

  // Show completion message when deck is empty
  if (currentIndex >= cars.length && hasCars) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">All Done!</h2>
            <p className="text-muted-foreground">You've swiped through all {cars.length} cars</p>
          </div>
          <Button variant="outline" onClick={resetDeck} aria-label="Restart deck">
            <RotateCcw className="mr-2 size-4"/>Start Over
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-border/60 bg-white/5 backdrop-blur-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-4">Recommendation Complete!</h3>
          <p className="text-muted-foreground mb-6">
            You've reviewed all {cars.length} cars matching your criteria
          </p>
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">
              Your Favorites ({favorites.length}):
            </p>
            <div className="space-y-1">
              {savedCars.map((car, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {car.year} {car.make} {car.model} - ${car.price.toLocaleString()}
                </p>
              ))}
            </div>
          </div>
          <Button size="lg" onClick={resetDeck}>
            <RotateCcw className="mr-2 size-4"/>Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Swipe Your Dream Car</h2>
          <p className="text-muted-foreground">Swipe right to save, left to skip. Use Cmd+\\ to refine your query.</p>
          <p className="text-xs text-muted-foreground" aria-live="polite">{hasCars ? `${cars.length} result${cars.length === 1 ? "" : "s"} found` : "No results"}</p>
          
          {/* OpenAI Status */}
          {isLoadingOpenai && (
            <p className="text-xs text-blue-400">🤖 Analyzing query with AI...</p>
          )}
          {openaiData && openaiData.success && (
            <div className="text-xs text-green-400">
              <p>✅ AI extracted: {openaiData.parsedData.make} {openaiData.parsedData.model}</p>
              {openaiData.parsedData.year && <p>Year: {openaiData.parsedData.year}</p>}
              {openaiData.parsedData.type && <p>Type: {openaiData.parsedData.type}</p>}
              {openaiData.parsedData.price && <p>Price: {openaiData.parsedData.price}</p>}
              {openaiData.configUpdated && (
                <p className="text-yellow-400">🔧 Updated scraper config with {openaiData.parsedData.make} {openaiData.parsedData.model}</p>
              )}
            </div>
          )}
          
          {/* Scraper Status */}
          {scraperResults && (
            <div className="text-xs">
              {scraperResults.success ? (
                <p className="text-green-400">🕷️ Found {scraperResults.carCount} real cars from Carfax</p>
              ) : (
                <p className="text-red-400">❌ Scraper failed: {scraperResults.error}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Star size={16} />
            <span>Sorted by rating</span>
          </div>
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
          <Button variant="outline" onClick={resetDeck} aria-label="Restart deck"><RotateCcw className="mr-2 size-4"/>Restart</Button>
        </div>
      </div>

      {!hasCars ? (
        <div className="text-center text-muted-foreground p-8">
          <div className="mb-3">No cars found for your filters.</div>
          <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new Event("open-search"))}>
            Refine search (Cmd+\\)
          </Button>
        </div>
      ) : (
        <div className="relative w-full h-[600px] mb-8">
          {/* Full Width Container */}
          <div className="relative w-full h-full flex items-center justify-center px-4">
            
            {/* Left Preview (Previous Card) */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[30%] h-[80%] z-10">
              {currentIndex > 0 ? (
                <motion.div
                  key={`left-${currentIndex}`}
                  initial={{ x: -100, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 0.4, scale: 0.8 }}
                  exit={{ x: -100, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full relative"
                >
                  <CarCard
                    car={cars[currentIndex - 1]}
                    onSwipe={() => {}}
                    onSave={() => {}}
                    saved={false}
                    interactive={false}
                  />
                  {/* Blur overlay for left preview */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-black/10 rounded-3xl border border-white/10" />
              )}
            </div>

            {/* Center Main Card */}
            <div className="relative w-[40%] h-[90%] z-20">
              <AnimatePresence mode="wait">
                {cars[currentIndex] && (
                  <motion.div
                    key={cars[currentIndex].id}
                    initial={{ scale: 0.9, opacity: 0, x: 0 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.9, opacity: 0, x: 300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <CarCard
                      car={cars[currentIndex]}
                      onSwipe={(direction) => direction === "right" ? handleSwipeRight() : handleSwipeLeft()}
                      onSave={(id) => toggleSave(id)}
                      saved={favorites.includes(cars[currentIndex].id)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Preview (Next Card) */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[30%] h-[80%] z-10">
              {currentIndex < cars.length - 1 ? (
                <motion.div
                  key={`right-${currentIndex}`}
                  initial={{ x: 100, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 0.6, scale: 0.8 }}
                  exit={{ x: 100, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full relative"
                >
                  <CarCard
                    car={cars[currentIndex + 1]}
                    onSwipe={() => {}}
                    onSave={() => {}}
                    saved={false}
                    interactive={false}
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-black/10 rounded-3xl border border-white/10" />
              )}
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-30">
              <span className="text-sm font-medium text-white">
                {currentIndex + 1} / {cars.length}
              </span>
            </div>

            {/* Favorites Counter */}
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-30">
              <span className="text-sm font-medium text-white">
                ❤️ {favorites.length}
              </span>
            </div>
          </div>

          {/* Action Buttons - Positioned below cards */}
          <div className="flex justify-center items-center space-x-12 z-30 relative">
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
      )}

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
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{c.year} {c.make} {c.model}</div>
                      <div className="text-xs text-muted-foreground">${c.price.toLocaleString()} • {c.type.toUpperCase()}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleSave(c.id)}>Remove</Button>
                  </div>
                  
                  {/* Additional info for saved cars */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    {c.mileage && <div>{c.mileage}</div>}
                    {c.location && <div>📍 {c.location}</div>}
                    {c.dealer && <div>🏪 {c.dealer}</div>}
                    {c.exterior_color && <div>🎨 {c.exterior_color}</div>}
                    {c.monthly_payment && c.monthly_payment.amount && (
                      <div className="text-green-400 font-medium">
                        ${Number(c.monthly_payment.amount).toFixed(0)}/mo
                      </div>
                    )}
                  </div>
                  
                  {/* Safety indicators */}
                  {(c.no_accidents || c.service_records) && (
                    <div className="mt-2 flex gap-1">
                      {c.no_accidents && <span className="text-xs bg-green-500/20 text-green-400 px-1 py-0.5 rounded">✅</span>}
                      {c.service_records && <span className="text-xs bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded">📋</span>}
                    </div>
                  )}
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
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
import { FaUndoAlt, FaHeart, FaTimes } from "react-icons/fa";

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
  <div className="relative w-full h-[600px] mb-8">
    {/* Cards Area */}
    <div className="relative w-full h-full flex items-center justify-center px-6">
      {/* Left Preview */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-[28%] h-[75%] z-10">
        {currentIndex > 0 && (
          <motion.div
            key={`left-${currentIndex}`}
            initial={{ x: -100, opacity: 0, scale: 0.85 }}
            animate={{ x: 0, opacity: 0.2, scale: 0.9 }}
            exit={{ x: -100, opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full relative rounded-2xl overflow-hidden 
                       border border-white/30 bg-white/10 backdrop-blur-lg shadow-md"
          >
            <CarCard
              car={cars[currentIndex - 1]}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
              isTop={false}
              stackIndex={-1}
              isPreview={true}
              previewSide="left"
            />
          </motion.div>
        )}
      </div>

      {/* Center Card */}
      <div className="relative w-[42%] h-[85%] z-20 rounded-3xl overflow-hidden 
                      border border-white/40 shadow-2xl backdrop-blur-xl bg-white/30">
        <AnimatePresence mode="wait">
          {cars[currentIndex] && (
            <motion.div
              key={cars[currentIndex].id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0, x: 300 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <CarCard
                car={cars[currentIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                isTop={true}
                stackIndex={0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Preview */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-[28%] h-[75%] z-10">
        {currentIndex < cars.length - 1 && (
          <motion.div
            key={`right-${currentIndex}`}
            initial={{ x: 100, opacity: 0, scale: 0.85 }}
            animate={{ x: 0, opacity: 0.2, scale: 0.9 }}
            exit={{ x: 100, opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full relative rounded-2xl overflow-hidden 
                       border border-white/30 bg-white/10 backdrop-blur-lg shadow-md"
          >
            <CarCard
              car={cars[currentIndex + 1]}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
              isTop={false}
              stackIndex={1}
              isPreview={true}
              previewSide="right"
            />
          </motion.div>
        )}
      </div>

      {/* Top badges */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 
                      bg-white/60 backdrop-blur-lg 
                      px-4 py-1 rounded-full text-sm font-semibold 
                      shadow-md border border-white/30">
        {currentIndex + 1} / {cars.length}
      </div>

      <div className="absolute top-6 right-6 
                      bg-white/60 backdrop-blur-lg 
                      px-3 py-1 rounded-full text-sm font-semibold 
                      shadow-md border border-white/30 flex items-center gap-1">
        <FaHeart className="text-pink-500" />
        {favorites.length}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-center items-center space-x-12 z-30 relative mt-6">
      {/* Dislike */}
      <motion.button
        onClick={handleSwipeLeft}
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl 
                   bg-white/50 backdrop-blur-lg border border-red-300 text-red-500 
                   shadow-lg hover:scale-110 transition hover:shadow-red-200"
        whileTap={{ scale: 0.9 }}
      >
        <FaTimes />
      </motion.button>

      {/* Rewind */}
      <motion.button
        onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl 
                    bg-white/50 backdrop-blur-lg border border-blue-300 text-blue-500 
                    shadow-lg transition ${
                      currentIndex === 0 
                        ? "opacity-40 cursor-not-allowed" 
                        : "hover:scale-110 hover:shadow-blue-200"
                    }`}
        disabled={currentIndex === 0}
        whileTap={currentIndex > 0 ? { scale: 0.9 } : {}}
      >
        <FaUndoAlt />
      </motion.button>

      {/* Like */}
      <motion.button
        onClick={handleSwipeRight}
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl 
                   bg-white/50 backdrop-blur-lg border border-green-300 text-green-500 
                   shadow-lg hover:scale-110 transition hover:shadow-green-200"
        whileTap={{ scale: 0.9 }}
      >
        <FaHeart />
      </motion.button>
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
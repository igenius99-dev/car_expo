"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  type: string; // sedan, suv, ev, etc
  range?: number; // for EVs
};

export default function CarCard({ car, onSwipe, onSave, saved, interactive = true }: {
  car: Car;
  onSwipe: (direction: "left" | "right") => void;
  onSave: (id: string) => void;
  saved: boolean;
  interactive?: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-200, 0, 200], [0.6, 1, 0.6]);
  const rightGlow = useTransform(x, [0, 160], [0, 1]);
  const leftGlow = useTransform(x, [0, -160], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (!interactive) return;
    if (info.offset.x > 120) onSwipe("right");
    else if (info.offset.x < -120) onSwipe("left");
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={interactive ? "x" : false}
      dragConstraints={interactive ? { left: 0, right: 0 } : undefined}
      dragElastic={interactive ? 0.5 : undefined}
      onDragEnd={handleDragEnd}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      className="relative w-full max-w-md aspect-[4/5] select-none cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      {/* Swipe glow overlays */}
      <motion.div
        aria-hidden
        style={{ opacity: rightGlow }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_80%_50%,_oklch(0.7_0.2_150/_20%)_0%,_transparent_60%)]"
      />
      <motion.div
        aria-hidden
        style={{ opacity: leftGlow }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_50%,_oklch(0.7_0.24_25/_22%)_0%,_transparent_60%)]"
      />

      <div className="relative w-full h-2/3">
        <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{car.year} {car.make} {car.model}</h3>
          <Button variant={saved ? "default" : "secondary"} size="icon" onClick={() => onSave(car.id)} aria-label="save">
            <Heart className={saved ? "fill-current" : ""} />
          </Button>
        </div>
        <div className="mt-1 text-muted-foreground flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs backdrop-blur-sm border border-white/10">{car.type}</span>
          {car.range ? <span className="text-xs">Range: {car.range} mi</span> : null}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-medium">${car.price.toLocaleString()}</span>
          <Button variant="outline" size="sm"><Info className="size-4 mr-1" />Details</Button>
        </div>
      </div>
    </motion.div>
  );
}
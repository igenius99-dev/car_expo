'use client'

export default function NightSky() {
  return (
    <div className="night-sky">
      {/* Subtle Twinkling Stars */}
      <div className="absolute inset-0">
        {/* Small stars with faint glow */}
        <div className="absolute top-1/4 left-1/4 animate-[twinkle-slow_6s_ease-in-out_infinite]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
        <div className="absolute top-1/3 left-2/3 animate-[twinkle-slow_6s_ease-in-out_infinite_1.5s]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
        <div className="absolute top-2/3 left-1/6 animate-[twinkle-slow_6s_ease-in-out_infinite_3s]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
        <div className="absolute top-3/4 left-3/4 animate-[twinkle-slow_6s_ease-in-out_infinite_4.5s]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
        <div className="absolute top-1/6 left-1/2 animate-[twinkle-slow_6s_ease-in-out_infinite_6s]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
        
        {/* Tiny stars with minimal glow */}
        <div className="absolute top-1/5 left-1/3 animate-[twinkle-medium_4s_ease-in-out_infinite]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-1/2 left-4/5 animate-[twinkle-medium_4s_ease-in-out_infinite_0.8s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-4/5 left-1/5 animate-[twinkle-medium_4s_ease-in-out_infinite_2s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-2/5 left-2/5 animate-[twinkle-medium_4s_ease-in-out_infinite_3.2s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-3/5 left-3/5 animate-[twinkle-medium_4s_ease-in-out_infinite_4.4s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        
        {/* Additional scattered tiny stars */}
        <div className="absolute top-1/8 left-1/8 animate-[twinkle-fast_3s_ease-in-out_infinite]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-3/8 left-5/8 animate-[twinkle-fast_3s_ease-in-out_infinite_0.5s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-5/8 left-7/8 animate-[twinkle-fast_3s_ease-in-out_infinite_1s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-7/8 left-1/8 animate-[twinkle-fast_3s_ease-in-out_infinite_1.5s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-1/2 left-1/2 animate-[twinkle-fast_3s_ease-in-out_infinite_2s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        
        {/* More scattered stars */}
        <div className="absolute top-1/12 left-1/4 animate-[twinkle-slow_5s_ease-in-out_infinite_2.5s]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
        <div className="absolute top-5/12 left-3/4 animate-[twinkle-medium_3.5s_ease-in-out_infinite_1.8s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-7/12 left-1/12 animate-[twinkle-fast_2.5s_ease-in-out_infinite_0.7s]">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_1px_rgba(255,255,255,0.3),0_0_2px_rgba(255,255,255,0.15)]" />
        </div>
        <div className="absolute top-11/12 left-5/6 animate-[twinkle-slow_5.5s_ease-in-out_infinite_4.2s]">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_2px_rgba(255,255,255,0.4),0_0_4px_rgba(255,255,255,0.2)]" />
        </div>
      </div>

      {/* Enhanced Shooting Stars with Trails */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 animate-[shooting-star-1_6s_ease-out_infinite_15s]">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7)]" />
        </div>
        <div className="absolute top-0 left-0 animate-[shooting-star-2_7s_ease-out_infinite_28s]">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7)]" />
        </div>
        <div className="absolute top-0 left-0 animate-[shooting-star-3_6.5s_ease-out_infinite_42s]">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7)]" />
        </div>
        <div className="absolute top-0 left-0 animate-[shooting-star-4_7.5s_ease-out_infinite_58s]">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7)]" />
        </div>
        <div className="absolute top-0 left-0 animate-[shooting-star-5_6.8s_ease-out_infinite_75s]">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_30px_rgba(255,255,255,0.7)]" />
        </div>
      </div>
    </div>
  )
}

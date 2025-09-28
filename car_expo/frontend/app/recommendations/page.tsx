"use client"

import MapPage from "@/components/Map"
import Recommender from "@/components/recommender/Recommender"
import { OpenSearchCta } from "@/components/recommendations/OpenSearchCta"

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = (params?.q || "").trim()

  return (
    <div className="relative h-screen overflow-hidden text-gray-900 dark:text-white">
      {/* Futuristic gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,_oklch(0.35_0.25_300/_45%)_0%,_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_90%_100%,_oklch(0.5_0.22_250/_30%)_0%,_transparent_70%)]" />

      {/* Shared header always visible */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-16">
        <header className="mb-8 flex flex-col items-start gap-3">
          <h1
            id="recs-heading"
            className="text-4xl text-white font-extrabold tracking-tight sm:text-5xl"
          >
            Recommendations
          </h1>
          {query ? (
            <p className="text-base font-bold text-white dark:text-gray-300">
              Query:{" "}
              <span className="font-semibold text-white">
                {query}
              </span>
            </p>
          ) : (
            <p className="text-base text-white dark:text-gray-400">
              Start by entering what you're looking for.
            </p>
          )}
        </header>
      </section>

      {/* Conditional body */}
      {!query ? (
        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center justify-center gap-5 rounded-2xl border border-border/60 bg-white/10 p-10 text-center shadow-lg backdrop-blur-xl dark:bg-black/30">
          <div className="text-xl text-white font-semibold">No query yet</div>
          <p className="text-sm text-white leading-relaxed">
            Open the search and describe your ideal car. <br />Example:{" "}
            <span className="italic text-white font-bold dark:text-gray-200">
              "EV under $25k, low mileage"
            </span>
          </p>
          <OpenSearchCta />
        </div>
      ) : (
        <div className="flex h-[calc(100vh-12rem)] w-full overflow-hidden"> 
          {/* adjust height to account for header space */}
          
          {/* Left: Map */}
          <div className="w-[40%] h-full border-r border-white/20 bg-black/20">
            <MapPage />
          </div>

          {/* Right: Recommendations */}
          <div className="w-[60%] h-full text-white flex flex-col 
                          bg-white/5 backdrop-blur-3xl border border-white/20 
                          rounded-none overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <section
              id="swipe"
              className="w-full py-8 md:py-12 relative z-10 h-full flex flex-col"
            >
              <div className="text-center mb-8 px-6">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Swipe Your Dream Car
                </h2>
                <p className="text-white max-w-2xl mx-auto">
                  Swipe right to save your favorites, left to skip. Find the perfect car for you!
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-3xl">
                  <Recommender key={query} query={query} />
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

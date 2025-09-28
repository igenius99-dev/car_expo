import Recommender from "@/components/recommender/Recommender";
import { OpenSearchCta } from "@/components/recommendations/OpenSearchCta";

export const metadata = {
  title: "Recommendations | Car Recommender",
  description: "Swipe through personalized car recommendations based on your search query.",
};

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params?.q || "").trim();

  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      {/* Futuristic gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,_oklch(0.35_0.25_300/_50%)_0%,_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_90%_100%,_oklch(0.5_0.22_250/_35%)_0%,_transparent_60%)]" />

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14" aria-labelledby="recs-heading">
        <header className="mb-6 flex flex-col items-start gap-2">
          <h1 id="recs-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">Recommendations</h1>
          {query ? (
            <p className="text-sm text-muted-foreground">
              Query: <span className="font-medium text-foreground">{query}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Start by entering what you're looking for.</p>
          )}
        </header>

        {!query ? (
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-5 rounded-2xl border border-border/60 bg-white/5 p-8 text-center backdrop-blur-xl dark:bg-black/20">
            <div className="text-lg font-medium">No query yet</div>
            <p className="text-sm text-muted-foreground">
              Open the search and describe your ideal car. Example: "EV under $25k, low mileage"
            </p>
            <OpenSearchCta />
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-white/5 p-4 backdrop-blur-xl dark:bg-black/20 sm:p-6">
            {/* Recommender handles stacked deck, swipe, favorites, and query filtering */}
            <Recommender key={query} query={query} />
          </div>
        )}
      </section>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const OpenSearchCta = () => {
  return (
    <div className="flex items-center gap-3">
      <Button size="lg" onClick={() => window.dispatchEvent(new Event("open-search"))}>
        Open search (Cmd+\\)
      </Button>
      <Button asChild variant="outline">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
};
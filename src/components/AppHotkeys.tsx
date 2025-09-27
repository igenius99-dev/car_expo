"use client";
import { useEffect, useState, useCallback } from "react";
import SearchOverlay from "./SearchOverlay";

export default function AppHotkeys() {
  const [open, setOpen] = useState(false);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const isToggle = (e.key === "\\" || e.code === "Backslash") && (e.metaKey || e.ctrlKey);
    if (isToggle) {
      e.preventDefault();
      setOpen((v) => !v);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    const openHandler = () => setOpen(true);
    window.addEventListener("open-search", openHandler as EventListener);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-search", openHandler as EventListener);
    };
  }, [onKeyDown]);

  return <SearchOverlay open={open} onOpenChange={setOpen} />;
}
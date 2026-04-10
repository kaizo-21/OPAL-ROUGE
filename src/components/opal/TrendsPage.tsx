"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { TrendGuideItem, TREND_CATEGORIES } from "@/lib/types";

const PAGE_SIZE = 12;

export default function TrendsPage() {
  const trends = useAppStore((s) => s.trends);
  const setQvItem = useAppStore((s) => s.setQvItem);

  // Local filter state for category
  const [activeCat, setActiveCat] = useState("All");

  // Infinite scroll state
  const [pageByKey, setPageByKey] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Build category list: "All" first, then TREND_CATEGORIES
  const categories = useMemo(() => ["All", ...TREND_CATEGORIES], []);

  // Derive current filter key and page (resets to 1 when filter changes)
  const filterKey = activeCat;
  const page = pageByKey[filterKey] ?? 1;

  // Filtering logic
  const getFilteredTrends = useCallback((): TrendGuideItem[] => {
    let items = [...trends];

    // Category filter
    if (activeCat !== "All") {
      items = items.filter((item) => item.cat === activeCat);
    }

    return items;
  }, [trends, activeCat]);

  const filtered = useMemo(() => getFilteredTrends(), [getFilteredTrends]);

  // Visible items based on page
  const visibleItems = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  );

  // Derived: all items loaded
  const done = visibleItems.length >= filtered.length;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || done) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => {
            setPageByKey((prev) => ({
              ...prev,
              [filterKey]: (prev[filterKey] ?? 1) + 1,
            }));
            setLoading(false);
          }, 300);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [done, loading, filterKey]);

  return (
    <section
      style={{
        background: "var(--charcoal)",
        minHeight: "100vh",
      }}
      className="w-full"
    >
      <div
        style={{
          paddingTop: "7rem",
          paddingLeft: "3.5rem",
          paddingRight: "3.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
        className="w-full"
      >
        {/* Section Header */}
        <div className="mb-8">
          <p
            style={{
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.6)",
            }}
            className="mb-2 font-medium"
          >
            Reading List
          </p>
          <h2
            className="font-serif font-light text-2xl md:text-3xl"
            style={{ color: "white" }}
          >
            Trend Guides
          </h2>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 items-center mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className="transition-all duration-200 cursor-pointer"
              style={{
                border:
                  activeCat === c
                    ? "1px solid var(--rose)"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                fontWeight: 400,
                background: activeCat === c ? "var(--rose)" : "transparent",
                color: activeCat === c ? "#fff" : "rgba(255,255,255,0.7)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p
              className="font-serif italic text-base"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              ✦ Add trend guides in Admin to show here ✦
            </p>
          </div>
        ) : (
          <>
            <div className="masonry-grid">
              {visibleItems.map((item) => (
                <div key={item.id} className="masonry-item">
                  <div
                    className="rounded-xl overflow-hidden card-hover cursor-pointer relative group"
                    onClick={() =>
                      setQvItem({ ...item, _type: "trends" })
                    }
                  >
                    {/* Image */}
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      className="w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const placeholder =
                          target.nextElementSibling as HTMLDivElement;
                        if (placeholder) placeholder.style.display = "flex";
                      }}
                    />
                    {/* Placeholder for broken images */}
                    <div
                      className="w-full items-center justify-center font-serif text-4xl"
                      style={{
                        display: "none",
                        background: "#3A3230",
                        color: "var(--rose)",
                        minHeight: "220px",
                      }}
                    >
                      {item.title?.charAt(0) || "T"}
                    </div>

                    {/* Gradient Overlay — always visible */}
                    <div
                      className="trend-overlay absolute inset-0 flex flex-col justify-end p-4"
                      style={{ opacity: 1 }}
                    >
                      <span
                        className="uppercase mb-1"
                        style={{
                          fontSize: "0.6rem",
                          letterSpacing: "0.12em",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {item.cat}
                      </span>
                      <span
                        className="font-serif text-sm text-white"
                      >
                        {item.title}
                      </span>
                      {item.date && (
                        <span
                          className="mt-1"
                          style={{
                            fontSize: "0.62rem",
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {!done && (
              <div ref={sentinelRef} className="flex justify-center py-8">
                {loading && (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "rgba(255,255,255,0.2)",
                        borderTopColor: "var(--rose)",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Loading…
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* All Loaded */}
            {done && filtered.length > 0 && (
              <p
                className="text-center py-8 text-sm"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                ✦ All items loaded
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

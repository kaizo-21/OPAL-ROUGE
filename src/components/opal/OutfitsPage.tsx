"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { OutfitItem, OUTFIT_CATEGORIES, ContentType } from "@/lib/types";

const PAGE_SIZE = 12;

export default function OutfitsPage() {
  const outfits = useAppStore((s) => s.outfits);
  const filters = useAppStore((s) => s.filters);
  const setFilter = useAppStore((s) => s.setFilter);
  const setQvItem = useAppStore((s) => s.setQvItem);
  const isWished = useAppStore((s) => s.isWished);
  const addWishlistItem = useAppStore((s) => s.addWishlistItem);
  const removeWishlistItem = useAppStore((s) => s.removeWishlistItem);

  const { cat, q, sort } = filters.outfits;

  // Infinite scroll state
  const [pageByKey, setPageByKey] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Derive current filter key and page (resets to 1 when filters change)
  const filterKey = `${cat}|${q}|${sort}`;
  const page = pageByKey[filterKey] ?? 1;

  // Build category list: "All" first, then OUTFIT_CATEGORIES
  const categories = useMemo(() => ["All", ...OUTFIT_CATEGORIES], []);

  // Filtering + sorting logic
  const getFilteredOutfits = useCallback((): OutfitItem[] => {
    let items = [...outfits];

    // Category filter
    if (cat !== "All") {
      items = items.filter((item) => item.cat === cat);
    }

    // Search filter
    if (q.trim()) {
      const query = q.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.cat.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sort === "oldest") {
      items = items.reverse();
    } else if (sort === "az") {
      items = items.sort((a, b) => a.title.localeCompare(b.title));
    }
    // "newest" = default order (no sort needed)

    return items;
  }, [outfits, cat, q, sort]);

  const filtered = useMemo(() => getFilteredOutfits(), [getFilteredOutfits]);

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
          // Simulate slight delay for UX
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

  // Wishlist toggle handler
  const toggleWish = (e: React.MouseEvent, item: OutfitItem) => {
    e.stopPropagation();
    const key = `outfits:${item.id}`;
    if (isWished(item.id, "outfits")) {
      removeWishlistItem(key);
    } else {
      addWishlistItem({
        key,
        type: "outfits" as ContentType,
        id: item.id,
        title: item.title,
        cat: item.cat,
        img: item.img,
        link: item.link,
      });
    }
  };

  return (
    <section
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
            color: "var(--rose)",
          }}
          className="mb-2 font-medium"
        >
          Style Diary
        </p>
        <h2 className="font-serif font-light text-2xl md:text-3xl" style={{ color: "var(--text)" }}>
          Outfit Inspiration
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Left: Category Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((c) => (
            <button
              key={c}
              className={`filter-pill${cat === c ? " active" : ""}`}
              data-cat={c}
              onClick={() => setFilter("outfits", { cat: c })}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Right: Search + Sort */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search outfits…"
            value={q}
            onInput={(e) =>
              setFilter("outfits", { q: (e.target as HTMLInputElement).value })
            }
            className="px-3 py-2 rounded-full text-sm border outline-none transition-colors"
            style={{
              background: "var(--surface)",
              borderColor: "rgba(201, 137, 122, 0.22)",
              color: "var(--text)",
              width: "180px",
            }}
          />
          <select
            value={sort}
            onChange={(e) =>
              setFilter("outfits", { sort: e.target.value })
            }
            className="px-3 py-2 rounded-full text-sm border outline-none cursor-pointer transition-colors"
            style={{
              background: "var(--surface)",
              borderColor: "rgba(201, 137, 122, 0.22)",
              color: "var(--text)",
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <span
            className="text-3xl mb-3"
            style={{ color: "var(--light-muted)" }}
          >
            ✦
          </span>
          <p
            className="font-serif italic text-base"
            style={{ color: "var(--muted-text)" }}
          >
            No outfits found
          </p>
        </div>
      ) : (
        <>
          <div className="masonry-grid">
            {visibleItems.map((item) => (
              <div key={item.id} className="masonry-item">
                <div
                  className="relative rounded-xl overflow-hidden card-hover cursor-pointer group"
                  onClick={() =>
                    setQvItem({ ...item, _type: "outfits" })
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
                      const placeholder = target.nextElementSibling as HTMLDivElement;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                  {/* Placeholder for broken images */}
                  <div
                    className="w-full items-center justify-center font-serif text-4xl"
                    style={{
                      display: "none",
                      background: "var(--cream)",
                      color: "var(--rose)",
                      minHeight: "220px",
                    }}
                  >
                    {item.title?.charAt(0) || "O"}
                  </div>

                  {/* Heart Button */}
                  <button
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 p-1.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(4px)",
                    }}
                    onClick={(e) => toggleWish(e, item)}
                    aria-label={isWished(item.id, "outfits") ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      size={16}
                      className="transition-colors"
                      style={{
                        fill: isWished(item.id, "outfits") ? "var(--rose)" : "none",
                        stroke: isWished(item.id, "outfits") ? "var(--rose)" : "var(--charcoal)",
                        strokeWidth: 2,
                      }}
                    />
                  </button>

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span
                      className="uppercase text-white mb-1"
                      style={{ fontSize: "0.6rem", letterSpacing: "0.12em" }}
                    >
                      {item.cat}
                    </span>
                    <span className="text-white font-serif text-sm">
                      {item.title}
                    </span>
                  </div>
                </div>

                {/* Meta below image */}
                <div className="pt-2.5 pb-1">
                  <p
                    className="uppercase mb-0.5"
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: "var(--rose)",
                    }}
                  >
                    {item.cat}
                  </p>
                  <p
                    className="font-serif truncate"
                    style={{ fontSize: "0.85rem", color: "var(--text)" }}
                  >
                    {item.title}
                  </p>
                  {item.date && (
                    <p
                      className="mt-0.5"
                      style={{ fontSize: "0.65rem", color: "var(--muted-text)" }}
                    >
                      {item.date}
                    </p>
                  )}
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
                      borderColor: "var(--cream)",
                      borderTopColor: "var(--rose)",
                    }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--muted-text)" }}
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
              style={{ color: "var(--light-muted)" }}
            >
              ✦ All items loaded
            </p>
          )}
        </>
      )}
    </section>
  );
}

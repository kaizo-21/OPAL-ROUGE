"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { AccessoryItem, ContentType, ACCESSORY_CATEGORIES } from "@/lib/types";
import { Heart, Search, Loader2 } from "lucide-react";

const PAGE_SIZE = 12;

export default function AccessoriesPage() {
  const { accessories, filters, setFilter, setQvItem, isWished, addWishlistItem, removeWishlistItem } =
    useAppStore();

  const af = filters.accessories;

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Wrapper to reset page when filters change
  const updateFilter = useCallback(
    (partial: Partial<typeof af>) => {
      setFilter("accessories", partial);
      setPage(1);
    },
    [setFilter]
  );

  // Filtering & sorting logic
  const getFilteredAccessories = useCallback((): AccessoryItem[] => {
    let items = [...accessories];

    // Category filter
    if (af.cat && af.cat !== "All") {
      items = items.filter((i) => i.cat === af.cat);
    }

    // Text search
    if (af.q) {
      const q = af.q.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.cat.toLowerCase().includes(q)
      );
    }

    // Sort
    const sort = af.sort || "newest";
    switch (sort) {
      case "oldest":
        items.reverse();
        break;
      case "az":
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price-lo":
        items.sort(
          (a, b) =>
            parseFloat(a.price.replace(/[^\d.]/g, "") || "0") -
            parseFloat(b.price.replace(/[^\d.]/g, "") || "0")
        );
        break;
      case "price-hi":
        items.sort(
          (a, b) =>
            parseFloat(b.price.replace(/[^\d.]/g, "") || "0") -
            parseFloat(a.price.replace(/[^\d.]/g, "") || "0")
        );
        break;
      case "newest":
      default:
        // Already in newest order (array order)
        break;
    }

    return items;
  }, [accessories, af.cat, af.q, af.sort]);

  const filtered = useMemo(() => getFilteredAccessories(), [getFilteredAccessories]);

  // Visible items based on page
  const visibleItems = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);

  // Derive done state
  const done = filtered.length > 0 && visibleItems.length >= filtered.length;

  // IntersectionObserver for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && !done) {
        setLoading(true);
        // Simulate async load
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setLoading(false);
        }, 300);
      }
    },
    [loading, done]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "200px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Category pills
  const categories = ["All", ...ACCESSORY_CATEGORIES];

  // Wishlist toggle
  const toggleWish = (e: React.MouseEvent, item: AccessoryItem) => {
    e.stopPropagation();
    const key = `accessories:${item.id}`;
    if (isWished(item.id, "accessories")) {
      removeWishlistItem(key);
    } else {
      addWishlistItem({
        key,
        type: "accessories",
        id: item.id,
        title: item.title,
        cat: item.cat,
        img: item.img,
        link: item.link,
        price: item.price,
      });
    }
  };

  return (
    <div
      className="max-w-[1400px] mx-auto"
      style={{ paddingTop: "7rem", paddingLeft: "3.5rem", paddingRight: "3.5rem" }}
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <p
          className="text-[0.62rem] tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--rose)" }}
        >
          Shop Now
        </p>
        <h2
          className="font-serif font-light text-2xl md:text-3xl"
          style={{ color: "var(--charcoal)" }}
        >
          The Accessories <em style={{ color: "var(--rose)" }}>Edit</em>
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Left: Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${af.cat === cat ? "active" : ""}`}
              onClick={() => updateFilter({ cat })}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right: Search + Sort */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-text)" }}
            />
            <input
              type="text"
              placeholder="Search accessories…"
              value={af.q}
              onInput={(e) =>
                updateFilter({ q: (e.target as HTMLInputElement).value })
              }
              className="pl-9 pr-4 py-2 rounded-full text-[0.78rem] w-[200px] focus:outline-none focus:ring-1"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(201, 137, 122, 0.2)",
                color: "var(--text)",
                // @ts-expect-error CSS custom property
                "--tw-ring-color": "var(--rose)",
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={af.sort}
            onChange={(e) => updateFilter({ sort: e.target.value })}
            className="py-2 px-3 rounded-full text-[0.72rem] tracking-[0.05em] uppercase focus:outline-none cursor-pointer"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(201, 137, 122, 0.2)",
              color: "var(--text)",
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
            <option value="price-lo">Price ↑</option>
            <option value="price-hi">Price ↓</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-20 font-serif italic text-[0.95rem]"
          style={{ color: "var(--light-muted)" }}
        >
          ✦ No accessories found
        </div>
      ) : (
        <>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden card-hover cursor-pointer group"
                style={{ background: "var(--surface)" }}
                onClick={() =>
                  setQvItem({ ...item, _type: "accessories" as ContentType })
                }
              >
                {/* Square image area */}
                <div className="relative aspect-square overflow-hidden">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-2xl font-serif italic"
                      style={{
                        background: "var(--blush)",
                        color: "var(--rose)",
                      }}
                    >
                      {item.title?.[0] || "✦"}
                    </div>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[0.58rem] tracking-wider uppercase text-white"
                      style={{ background: "var(--rose)" }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Heart button */}
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background: isWished(item.id, "accessories")
                        ? "var(--rose)"
                        : "rgba(255,255,255,0.85)",
                    }}
                    onClick={(e) => toggleWish(e, item)}
                    aria-label={isWished(item.id, "accessories") ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      size={14}
                      className={
                        isWished(item.id, "accessories") ? "fill-white" : ""
                      }
                      style={{
                        color: isWished(item.id, "accessories")
                          ? "#fff"
                          : "var(--rose)",
                      }}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p
                    className="text-[0.6rem] tracking-[0.15em] uppercase mb-1"
                    style={{ color: "var(--rose)" }}
                  >
                    {item.cat}
                  </p>
                  <p
                    className="font-serif text-[0.82rem] mb-1 truncate"
                    style={{ color: "var(--charcoal)" }}
                  >
                    {item.title}
                  </p>
                  {item.price && (
                    <p
                      className="font-serif italic text-[0.85rem]"
                      style={{ color: "var(--rose)" }}
                    >
                      {item.price}
                    </p>
                  )}
                  <p
                    className="text-[0.65rem] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: "var(--rose)" }}
                  >
                    Tap to view ↗
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2
                size={24}
                className="animate-spin"
                style={{ color: "var(--rose)" }}
              />
            </div>
          )}

          {/* All loaded message */}
          {done && !loading && (
            <div
              className="text-center py-8 text-[0.78rem] font-serif italic"
              style={{ color: "var(--light-muted)" }}
            >
              ✦ All items loaded
            </div>
          )}
        </>
      )}
    </div>
  );
}

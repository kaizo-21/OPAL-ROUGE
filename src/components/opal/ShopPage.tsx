"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ShopLookItem, ContentType, SHOP_CATEGORIES } from "@/lib/types";

const PAGE_SIZE = 12;

/** Parse the `products` string into { name, link } pairs. */
function parseProducts(raw: string): { name: string; link: string }[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .filter((line) => line.includes("|"))
    .map((line) => {
      const parts = line.split("|");
      return { name: (parts[0] ?? "").trim(), link: (parts[1] ?? "").trim() };
    })
    .filter((p) => p.name);
}

export default function ShopPage() {
  const shop = useAppStore((s) => s.shop);
  const setQvItem = useAppStore((s) => s.setQvItem);
  const isWished = useAppStore((s) => s.isWished);
  const addWishlistItem = useAppStore((s) => s.addWishlistItem);
  const removeWishlistItem = useAppStore((s) => s.removeWishlistItem);

  // Local filter state (shop has no dedicated filters in global store)
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("newest");

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset page when filters change
  const updateCat = useCallback((c: string) => {
    setCat(c);
    setPage(1);
  }, []);

  const updateSort = useCallback((s: string) => {
    setSort(s);
    setPage(1);
  }, []);

  // Build category list: "All" first, then SHOP_CATEGORIES
  const categories = useMemo(() => ["All", ...SHOP_CATEGORIES], []);

  // Filtering + sorting logic
  const getFilteredShop = useCallback((): ShopLookItem[] => {
    let items = [...shop];

    // Category filter
    if (cat !== "All") {
      items = items.filter((item) => item.cat === cat);
    }

    // Sort
    if (sort === "oldest") {
      items = items.reverse();
    } else if (sort === "az") {
      items = items.sort((a, b) => a.title.localeCompare(b.title));
    }
    // "newest" = default order (no sort needed)

    return items;
  }, [shop, cat, sort]);

  const filtered = useMemo(() => getFilteredShop(), [getFilteredShop]);

  // Visible items based on page
  const visibleItems = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page]
  );

  // Derive: all items loaded
  const done = filtered.length > 0 && visibleItems.length >= filtered.length;

  // IntersectionObserver for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && !done) {
        setLoading(true);
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

  // Wishlist toggle handler
  const toggleWish = (e: React.MouseEvent, item: ShopLookItem) => {
    e.stopPropagation();
    const key = `shop:${item.id}`;
    if (isWished(item.id, "shop")) {
      removeWishlistItem(key);
    } else {
      addWishlistItem({
        key,
        type: "shop" as ContentType,
        id: item.id,
        title: item.title,
        cat: item.cat,
        img: item.img,
        link: "",
      });
    }
  };

  // Empty state when no items at all
  if (shop.length === 0) {
    return (
      <section
        className="w-full"
        style={{
          paddingTop: "7rem",
          paddingLeft: "3.5rem",
          paddingRight: "3.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div className="mb-8">
          <p
            className="mb-2 font-medium"
            style={{
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--rose)",
            }}
          >
            Shoppable Looks
          </p>
          <h2
            className="font-serif font-light text-2xl md:text-3xl"
            style={{ color: "var(--text)" }}
          >
            Shop the Look
          </h2>
        </div>
        <div
          className="flex flex-col items-center justify-center py-24 font-serif italic"
          style={{ color: "var(--light-muted)" }}
        >
          ✦ Add shop looks in Admin to show here ✦
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full"
      style={{
        paddingTop: "7rem",
        paddingLeft: "3.5rem",
        paddingRight: "3.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Section Header */}
      <div className="mb-8">
        <p
          className="mb-2 font-medium"
          style={{
            fontSize: "0.62rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--rose)",
          }}
        >
          Shoppable Looks
        </p>
        <h2
          className="font-serif font-light text-2xl md:text-3xl"
          style={{ color: "var(--text)" }}
        >
          Shop the Look
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
              onClick={() => updateCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Right: Sort */}
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
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

      {/* Grid or Filtered Empty State */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 font-serif italic"
          style={{ color: "var(--light-muted)" }}
        >
          ✦ Add shop looks in Admin to show here ✦
        </div>
      ) : (
        <>
          <div className="masonry-grid">
            {visibleItems.map((item) => {
              const products = parseProducts(item.products);

              return (
                <div key={item.id} className="masonry-item">
                  <div
                    className="relative rounded-xl overflow-hidden card-hover cursor-pointer group"
                    style={{ background: "var(--surface)" }}
                    onClick={() =>
                      setQvItem({ ...item, _type: "shop" as ContentType })
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
                        background: "var(--cream)",
                        color: "var(--rose)",
                        minHeight: "220px",
                      }}
                    >
                      {item.title?.charAt(0) || "✦"}
                    </div>

                    {/* Heart Button */}
                    <button
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 p-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(4px)",
                      }}
                      onClick={(e) => toggleWish(e, item)}
                      aria-label={
                        isWished(item.id, "shop")
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={16}
                        className="transition-colors"
                        style={{
                          fill: isWished(item.id, "shop")
                            ? "var(--rose)"
                            : "none",
                          stroke: isWished(item.id, "shop")
                            ? "var(--rose)"
                            : "var(--charcoal)",
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

                  {/* Product rows below image */}
                  {products.length > 0 && (
                    <div className="pt-2.5 pb-1 px-1">
                      {products.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1"
                          style={{
                            borderBottom:
                              idx < products.length - 1
                                ? "1px solid rgba(201, 137, 122, 0.12)"
                                : "none",
                          }}
                        >
                          <span
                            className="font-serif truncate mr-2"
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text)",
                            }}
                          >
                            {p.name}
                          </span>
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="flex-shrink-0 text-[0.68rem] uppercase tracking-wider font-medium transition-opacity hover:opacity-70"
                              style={{ color: "var(--rose)" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Shop
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Infinite Scroll Sentinel */}
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

          {/* All Loaded */}
          {done && !loading && (
            <p
              className="text-center py-8 text-sm font-serif italic"
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

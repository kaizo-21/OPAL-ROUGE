"use client";
import React from "react";
import { useAppStore } from "../../lib/store";
import { OutfitItem, AccessoryItem, ContentType } from "../../lib/types";
import { ArrowRight } from "lucide-react";


export default function HomePage() {
  const { outfits, accessories, setCurrentPage, setQvItem, siteSettings } = useAppStore();

  const featuredOutfits = outfits
    .filter((o) => o.featured !== "no")
    .slice(0, siteSettings.ofLim);
  const featuredAccessories = accessories
    .filter((a) => a.featured !== "no")
    .slice(0, siteSettings.acLim);

  const heroImages = [...outfits.slice(0, 2), ...accessories.slice(0, 1)];

  const openItem = (item: OutfitItem | AccessoryItem, type: ContentType) => {
    setQvItem({ ...item, _type: type as ContentType });
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="flex items-center"
        style={{ paddingTop: "62px", minHeight: "100vh" }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-12">
          {/* Left: Text */}
          <div className="py-8 md:py-0">
            <p
              className="text-[0.65rem] tracking-[0.22em] uppercase mb-4 relative pl-8"
              style={{ color: "var(--rose)" }}
            >
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-px"
                style={{ background: "var(--rose)" }}
              />
              New Season Curation
            </p>
            <h1
              className="font-serif font-light leading-tight mb-6"
              style={{
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                color: "var(--charcoal)",
              }}
            >
              Elevated Style.{" "}
              <em style={{ color: "var(--rose)" }}>Curated Finds.</em>{" "}
              Effortless Elegance.
            </h1>
            <p
              className="text-[0.87rem] leading-[1.9] max-w-[400px] mb-8"
              style={{ color: "var(--muted-text)" }}
            >
              Discover handpicked fashion, accessories, and outfit inspiration
              for the modern woman. Every look, every piece — thoughtfully
              curated for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentPage("shop")}
                className="px-6 py-3 text-[0.72rem] tracking-[0.1em] uppercase text-white rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "var(--charcoal)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--rose)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--charcoal)")
                }
              >
                Shop the Look
              </button>
              <button
                onClick={() => setCurrentPage("outfits")}
                className="px-6 py-3 text-[0.72rem] tracking-[0.1em] uppercase rounded-full transition-all hover:-translate-y-0.5"
                style={{
                  border: "1px solid rgba(201, 137, 122, 0.5)",
                  color: "var(--rose)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--rose)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--rose)";
                }}
              >
                Explore Outfits
              </button>
            </div>
          </div>

          {/* Right: Collage */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {heroImages.length >= 3 ? (
              <>
                <div
                  className="col-span-2 rounded-xl overflow-hidden card-hover cursor-pointer relative group aspect-video"
                  onClick={() => heroImages[0] && openItem(heroImages[0], "outfits")}
                >
                  {heroImages[0]?.img ? (
                    <img
                      src={heroImages[0].img}
                      alt={heroImages[0].title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-3xl font-serif italic"
                      style={{
                        background: "var(--cream)",
                        color: "var(--rose)",
                      }}
                    >
                      O&R
                    </div>
                  )}
                  <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-[0.7rem] tracking-[0.1em] uppercase">
                      {heroImages[0]?.cat}
                    </span>
                  </div>
                </div>
                {heroImages.slice(1, 3).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden card-hover cursor-pointer relative group aspect-[3/4]"
                    onClick={() =>
                      item && openItem(
                        item,
                        i === 0 ? "outfits" : "accessories"
                      )
                    }
                  >
                    {item?.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
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
                        *
                      </div>
                    )}
                    <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-[0.65rem] tracking-[0.1em] uppercase">
                        {item?.cat}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div
                className="col-span-2 rounded-xl flex items-center justify-center text-2xl font-serif italic"
                style={{ background: "var(--cream)", color: "var(--rose)" }}
              >
                * Curated Finds *
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Outfit Preview Section */}
      <section className="py-16" style={{ background: "var(--surface)" }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <p
              className="text-[0.62rem] tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--rose)" }}
            >
              Fresh Picks
            </p>
            <h2
              className="font-serif font-light text-2xl md:text-3xl"
              style={{ color: "var(--charcoal)" }}
            >
              Outfit <em style={{ color: "var(--rose)" }}>Inspiration</em>
            </h2>
          </div>

          {featuredOutfits.length === 0 ? (
            <div
              className="text-center py-16 font-serif italic text-[0.9rem]"
              style={{ color: "var(--light-muted)" }}
            >
              * Add outfit posts in Admin to show here *
            </div>
          ) : (
            <div className="masonry-grid">
              {featuredOutfits.map((item) => (
                <div
                  key={item.id}
                  className="masonry-item card-hover cursor-pointer relative group rounded-xl overflow-hidden"
                  onClick={() => openItem(item, "outfits")}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full min-h-[200px] flex items-center justify-center text-xl font-serif italic aspect-[3/4]"
                      style={{
                        background: "var(--blush)",
                        color: "var(--rose)",
                      }}
                    >
                      {item.title?.[0] || "*"}
                    </div>
                  )}
                  <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <span className="text-white/80 text-[0.6rem] tracking-[0.15em] uppercase">
                      {item.cat}
                    </span>
                    <span className="text-white font-serif text-[0.85rem]">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => setCurrentPage("outfits")}
              className="px-6 py-3 text-[0.72rem] tracking-[0.1em] uppercase rounded-full transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              style={{
                border: "1px solid rgba(201, 137, 122, 0.5)",
                color: "var(--rose)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--rose)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--rose)";
              }}
            >
              View All Outfits
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Accessories Preview Section */}
      <section className="py-16" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <p
              className="text-[0.62rem] tracking-[0.2em] uppercase mb-2"
              style={{ color: "var(--rose)" }}
            >
              The Edit
            </p>
            <h2
              className="font-serif font-light text-2xl md:text-3xl"
              style={{ color: "var(--charcoal)" }}
            >
              Curated <em style={{ color: "var(--rose)" }}>Accessories</em>
            </h2>
          </div>

          {featuredAccessories.length === 0 ? (
            <div
              className="text-center py-16 font-serif italic text-[0.9rem]"
              style={{ color: "var(--light-muted)" }}
            >
              ✦ Add accessories in Admin to show here ✦
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredAccessories.map((item) => (
                <div
                  key={item.id}
                  className="card-hover cursor-pointer rounded-xl overflow-hidden group"
                  style={{ background: "var(--surface)" }}
                  onClick={() => openItem(item, "accessories")}
                >
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
                        {item.title?.[0] || "*"}
                      </div>
                    )}
                    {item.badge && (
                      <span
                        className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[0.58rem] tracking-wider uppercase text-white"
                        style={{ background: "var(--rose)" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
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
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => setCurrentPage("accessories")}
              className="px-6 py-3 text-[0.72rem] tracking-[0.1em] uppercase rounded-full transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              style={{
                border: "1px solid rgba(201, 137, 122, 0.5)",
                color: "var(--rose)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--rose)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--rose)";
              }}
            >
              View All Accessories
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Pinterest CTA */}
      <section
        className="py-10"
        style={{ background: "var(--charcoal)" }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-white/60 mb-2">
              Follow Us
            </p>
            <h3 className="font-serif text-xl md:text-2xl text-white">
              @opalrougeoutfits
            </h3>
          </div>
          <a
            href="https://in.pinterest.com/opalrougeoutfits/"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="px-6 py-3 text-[0.72rem] tracking-[0.1em] uppercase text-white rounded-full transition-all hover:-translate-y-0.5"
            style={{ background: "var(--rose)" }}
          >
            Follow on Pinterest -
          </a>
        </div>
      </section>
    </div>
  );
}

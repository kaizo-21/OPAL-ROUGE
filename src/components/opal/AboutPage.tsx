"use client";

import { useAppStore } from "@/lib/store";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function AboutPage() {
  const { outfits, accessories, trends, wishlist, setCurrentPage } =
    useAppStore();

  const stats = [
    { label: "Outfit Count", value: outfits.length },
    { label: "Accessory Count", value: accessories.length },
    { label: "Trend Count", value: trends.length },
    { label: "Wishlist Saves", value: wishlist.length },
  ];

  return (
    <section style={{ paddingTop: "8rem", paddingBottom: "6rem" }}>
      <div
        className="mx-auto px-8"
        style={{ maxWidth: "840px", paddingLeft: "3.5rem", paddingRight: "3.5rem" }}
      >
        {/* Section Header */}
        <div className="text-left mb-10">
          <p
            className="text-[0.62rem] tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--rose)" }}
          >
            Our Story
          </p>
          <h2
            className="font-serif font-light text-2xl md:text-3xl"
            style={{ color: "var(--charcoal)" }}
          >
            About Opal & Rouge
          </h2>
        </div>

        {/* Brand Copy */}
        <div className="space-y-5 mb-14">
          <p
            className="text-[0.88rem] leading-[1.85]"
            style={{ color: "var(--muted-text)" }}
          >
            Opal & Rouge is your destination for curated fashion inspiration,
            outfit ideas, and elegant style guides — all handpicked for the
            modern woman who values timeless elegance.
          </p>
          <p
            className="text-[0.88rem] leading-[1.85]"
            style={{ color: "var(--muted-text)" }}
          >
            Every look, every accessory, every trend guide is carefully selected
            to bridge aspirational style with affordable, shoppable finds. We
            believe fashion should be effortless, not overwhelming.
          </p>
          <p
            className="text-[0.88rem] leading-[1.85]"
            style={{ color: "var(--muted-text)" }}
          >
            Our goal is simple: to make fashion inspiration easy, accessible,
            and beautifully curated — one look at a time.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center py-6 px-3 rounded-xl"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(201, 137, 122, 0.1)",
              }}
            >
              <p
                className="font-serif italic mb-1"
                style={{
                  fontSize: "2.3rem",
                  color: "var(--rose)",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-[0.6rem] tracking-[0.15em] uppercase"
                style={{ color: "var(--light-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentPage("outfits")}
            className="px-6 py-3 text-[0.72rem] tracking-[0.1em] uppercase text-white rounded-full transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
            style={{ background: "var(--rose)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--deep-rose)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rose)")
            }
          >
            Explore the Collection
            <ArrowRight size={14} />
          </button>
          <a
            href="https://in.pinterest.com/opalrougeoutfits/"
            target="_blank"
            rel="noopener noreferrer sponsored"
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
            Our Pinterest
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

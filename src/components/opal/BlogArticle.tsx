"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ContentType } from "@/lib/types";
import { useRouter } from "next/navigation";

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

const DEFAULT_DISC = "Some links on this page are affiliate links. Opal & Rouge is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, Opal & Rouge earns from qualifying purchases.";

export default function BlogArticle() {
  const blogItem = useAppStore((s) => s.blogItem);
  const setBlogItem = useAppStore((s) => s.setBlogItem);
  const siteSettings = useAppStore((s) => s.siteSettings);
  const router = useRouter();

  if (!blogItem) return null;

  const isOutfit = blogItem._type === "outfits";
  const desc = isOutfit
    ? (blogItem as { desc?: string }).desc
    : undefined;
  const products = !isOutfit
    ? parseProducts((blogItem as { products?: string }).products ?? "")
    : [];
  const link = isOutfit
    ? (blogItem as { link?: string }).link
    : undefined;

  // Intro paragraph
  const introText =
    desc ||
    "Looking polished doesn't have to be complicated. This look combines effortless elegance with everyday comfort, perfect for making a statement without trying too hard.";

  // Formatted date
  const formattedDate = blogItem.date
    ? new Date(blogItem.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Back handler
  const handleBack = () => {
    setBlogItem(null);
    router.push("/outfit-ideas");
  };

  return (
    <article className="w-full">
      {/* ── Hero Section ── */}
      <header
        style={{
          padding: "8rem 3.5rem 4rem",
          background: "var(--surface)",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {/* Category Tag */}
          <span
            className="inline-block mb-4 uppercase font-medium rounded-full"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              color: "var(--rose)",
              background: "rgba(201, 137, 122, 0.12)",
              padding: "0.3rem 0.9rem",
            }}
          >
            {blogItem.cat}
          </span>

          {/* Title */}
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(1.9rem, 3.8vw, 2.9rem)",
              fontWeight: 300,
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            {blogItem.title}
          </h1>

          {/* Meta */}
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--muted-text)",
              letterSpacing: "0.04em",
            }}
          >
            {formattedDate && `${formattedDate} · `}
            {blogItem.cat}
          </p>
        </div>
      </header>

      {/* ── Body Section ── */}
      <div
        style={{
          padding: "2.8rem 3.5rem 5rem",
          maxWidth: 780,
          margin: "0 auto",
        }}
      >
        {/* Intro Paragraph */}
        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.85,
            color: "var(--muted-text)",
            marginBottom: "2.2rem",
          }}
        >
          {introText}
        </p>

        {/* Product Blocks — when products exist */}
        {products.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            {products.map((p, idx) => (
              <div
                key={idx}
                className="prod-block flex items-center gap-3"
                style={{
                  padding: "1rem 0",
                  borderBottom:
                    idx < products.length - 1
                      ? "1px solid rgba(201, 137, 122, 0.12)"
                      : "none",
                }}
              >
                {/* Icon Placeholder */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: 42,
                    height: 42,
                    background: "rgba(201, 137, 122, 0.1)",
                    color: "var(--rose)",
                  }}
                >
                  <ShoppingBag size={18} />
                </div>

                {/* Name + Category */}
                <div className="flex-1 min-w-0">
                  <p
                    className="uppercase tracking-wider"
                    style={{
                      fontSize: "0.58rem",
                      color: "var(--rose)",
                      marginBottom: 2,
                    }}
                  >
                    {blogItem.cat}
                  </p>
                  <p
                    className="font-serif truncate"
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text)",
                    }}
                  >
                    {p.name}
                  </p>
                </div>

                {/* Shop CTA */}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex-shrink-0 uppercase tracking-wider font-medium transition-opacity hover:opacity-70"
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--rose)",
                    }}
                  >
                    Shop →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Single Link — when item.link but no products */}
        {!products.length && link && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div
              className="prod-block flex items-center gap-4"
              style={{
                padding: "1.2rem",
                borderRadius: "0.75rem",
                background: "var(--surface)",
                border: "1px solid rgba(201, 137, 122, 0.12)",
              }}
            >
              {/* Item Image */}
              <div
                className="flex-shrink-0 overflow-hidden rounded-lg"
                style={{ width: 64, height: 64 }}
              >
                <img
                  src={blogItem.img}
                  alt={blogItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>

              {/* Title + Desc */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-serif truncate"
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {blogItem.title}
                </p>
                {desc && (
                  <p
                    className="truncate"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-text)",
                    }}
                  >
                    {desc}
                  </p>
                )}
              </div>

              {/* Shop CTA */}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex-shrink-0 uppercase tracking-wider font-medium transition-opacity hover:opacity-70"
                style={{
                  fontSize: "0.7rem",
                  color: "var(--rose)",
                }}
              >
                Shop →
              </a>
            </div>
          </div>
        )}

        {/* ── Styling Tips ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            className="font-serif"
            style={{
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: "1rem",
            }}
          >
            Styling Tips
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              lineHeight: 1.85,
              color: "var(--muted-text)",
            }}
          >
            Pair this look with minimal accessories for a refined finish. Keep
            your accessories understated — delicate pieces work beautifully here.
            Consider the occasion: layer up for evening events, keep it simple
            for daytime. Confidence is always the best accessory.
          </p>
        </section>

        {/* ── Disclaimer ── */}
        <section
          style={{
            marginBottom: "2.5rem",
            paddingBottom: "1.5rem",
            borderBottom: "2px solid var(--rose)",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              lineHeight: 1.7,
              color: "var(--muted-text)",
            }}
          >
            {siteSettings.disc || DEFAULT_DISC}
          </p>
        </section>

        {/* ── Back Button ── */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 transition-all duration-200"
          style={{
            border: "1px solid var(--rose)",
            background: "transparent",
            color: "var(--rose)",
            padding: "0.6rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "var(--rose)";
            btn.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "transparent";
            btn.style.color = "var(--rose)";
          }}
        >
          <ArrowLeft size={14} />
          Back to Outfits
        </button>
      </div>
    </article>
  );
}

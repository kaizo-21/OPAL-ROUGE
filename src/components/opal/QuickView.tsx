"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type {
  OutfitItem,
  AccessoryItem,
  ShopLookItem,
  TrendGuideItem,
  ContentType,
} from "@/lib/types";

/* ── helpers ─────────────────────────────────────────────── */

type QVItem = (OutfitItem | AccessoryItem | ShopLookItem | TrendGuideItem) & {
  _type?: ContentType;
};

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

/* ── QVImage — isolated so `key` change resets error state ─ */

function QVImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="w-full flex items-center justify-center font-serif text-6xl"
        style={{
          background: "var(--cream)",
          color: "var(--rose)",
          minHeight: "380px",
        }}
      >
        {alt?.charAt(0) || "✦"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="qv-img w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}

/* ── component ───────────────────────────────────────────── */

export default function QuickView() {
  const qvItem = useAppStore((s) => s.qvItem);
  const setQvItem = useAppStore((s) => s.setQvItem);
  const outfits = useAppStore((s) => s.outfits);
  const accessories = useAppStore((s) => s.accessories);
  const shop = useAppStore((s) => s.shop);
  const trends = useAppStore((s) => s.trends);
  const isWished = useAppStore((s) => s.isWished);
  const addWishlistItem = useAppStore((s) => s.addWishlistItem);
  const removeWishlistItem = useAppStore((s) => s.removeWishlistItem);

  // Toast state for "Link copied"
  const [toast, setToast] = useState<string | null>(null);

  /* ── body scroll lock ────────────────────────────────── */
  useEffect(() => {
    if (qvItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [qvItem]);

  /* ── escape key ──────────────────────────────────────── */
  useEffect(() => {
    if (!qvItem) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQvItem(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [qvItem, setQvItem]);

  /* ── toast auto-dismiss ──────────────────────────────── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── close ───────────────────────────────────────────── */
  const close = useCallback(() => setQvItem(null), [setQvItem]);

  /* ── wishlist toggle ─────────────────────────────────── */
  const toggleWish = useCallback(() => {
    if (!qvItem) return;
    const type = qvItem._type || "outfits";
    const key = `${type}:${qvItem.id}`;
    if (isWished(qvItem.id, type)) {
      removeWishlistItem(key);
    } else {
      addWishlistItem({
        key,
        type,
        id: qvItem.id,
        title: qvItem.title,
        cat: qvItem.cat,
        img: qvItem.img,
        link: "link" in qvItem ? (qvItem as OutfitItem).link : "",
        price: "price" in qvItem ? (qvItem as AccessoryItem).price : undefined,
      });
    }
  }, [qvItem, isWished, addWishlistItem, removeWishlistItem]);

  /* ── share handlers ──────────────────────────────────── */
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareImg = qvItem?.img || "";
  const shareTitle = qvItem?.title || "";

  const sharePinterest = useCallback(() => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImg)}&description=${encodeURIComponent(shareTitle)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareUrl, shareImg, shareTitle]);

  const shareWhatsApp = useCallback(() => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareTitle, shareUrl]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setToast("Link copied ✦");
    });
  }, [shareUrl]);

  /* ── related items ───────────────────────────────────── */
  const relatedItems = useMemo(() => {
    if (!qvItem) return [];
    const type = qvItem._type || "outfits";
    let pool: QVItem[] = [];

    if (type === "outfits") {
      pool = outfits.map((o) => ({ ...o, _type: "outfits" as ContentType }));
    } else if (type === "accessories") {
      pool = accessories.map((a) => ({
        ...a,
        _type: "accessories" as ContentType,
      }));
    } else if (type === "shop") {
      pool = shop.map((s) => ({ ...s, _type: "shop" as ContentType }));
    } else if (type === "trends") {
      pool = trends.map((t) => ({ ...t, _type: "trends" as ContentType }));
    }

    return pool
      .filter((i) => i.cat === qvItem.cat && i.id !== qvItem.id)
      .slice(0, 8);
  }, [qvItem, outfits, accessories, shop, trends]);

  /* ── product list ────────────────────────────────────── */
  const products = useMemo(() => {
    if (!qvItem || !("products" in qvItem)) return [];
    return parseProducts((qvItem as ShopLookItem).products || "");
  }, [qvItem]);

  /* ── derived fields ──────────────────────────────────── */
  const itemLink =
    qvItem && "link" in qvItem ? (qvItem as OutfitItem).link : "";
  const itemPrice =
    qvItem && "price" in qvItem ? (qvItem as AccessoryItem).price : "";
  const itemDesc =
    qvItem && "desc" in qvItem
      ? (qvItem as OutfitItem | AccessoryItem | TrendGuideItem).desc
      : "";
  const itemBadge =
    qvItem && "badge" in qvItem ? (qvItem as AccessoryItem).badge : "";

  /* ── render ──────────────────────────────────────────── */
  if (!qvItem) return null;

  const type = qvItem._type || "outfits";
  const wished = isWished(qvItem.id, type);

  return (
    <>
      {/* ─── Backdrop ─── */}
      <div
        className="qv-fade fixed inset-0 z-[500]"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={close}
        aria-hidden="true"
      />

      {/* ─── Modal ─── */}
      <div
        className="qv-up fixed z-[500] overflow-y-auto rounded-2xl"
        style={{
          background: "var(--bg)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "1000px",
          width: "calc(100% - 2rem)",
          maxHeight: "85vh",
          display: "grid",
          gridTemplateColumns: "minmax(400px, 1fr) 1.2fr",
        }}

        role="dialog"
        aria-modal="true"
        aria-label={qvItem.title}
      >
        {/* ─── Left Panel — Image ─── */}
        <div 
          className="relative sticky top-0 self-start overflow-hidden bg-neutral-50" 
          style={{ height: "100%", minHeight: "500px" }}
        >
          <QVImage key={qvItem.id} src={qvItem.img} alt={qvItem.title} />


          {/* Badge tray */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {/* Category badge */}
            <span
              className="px-2.5 py-1 rounded-full uppercase font-medium"
              style={{
                background: "white",
                color: "var(--rose)",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
              }}
            >
              {qvItem.cat}
            </span>
            {/* Price badge */}
            {itemPrice && (
              <span
                className="px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: "var(--rose)",
                  color: "white",
                  fontSize: "0.62rem",
                }}
              >
                {itemPrice}
              </span>
            )}
            {/* Custom badge */}
            {itemBadge && (
              <span
                className="px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: "var(--deep-rose)",
                  color: "white",
                  fontSize: "0.58rem",
                }}
              >
                {itemBadge}
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{
              background: "white",
              width: "32px",
              height: "32px",
            }}
            onClick={close}
            aria-label="Close quick view"
          >
            <X size={16} style={{ color: "var(--charcoal)" }} />
          </button>
        </div>

        {/* ─── Right Panel — Details ─── */}
        <div className="flex flex-col p-6 sm:p-10">

          {/* Eyebrow */}
          <p
            className="uppercase font-medium mb-1.5"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              color: "var(--rose)",
            }}
          >
            {qvItem.cat}
          </p>

          {/* Title */}
          <h2
            className="font-serif mb-3"
            style={{
              fontSize: "1.55rem",
              fontWeight: 300,
              color: "var(--text)",
              lineHeight: 1.25,
            }}
          >
            {qvItem.title}
          </h2>

          {/* Description */}
          {itemDesc && (
            <p
              className="mb-4"
              style={{
                fontSize: "0.83rem",
                lineHeight: 1.85,
                color: "var(--muted-text)",
              }}
            >
              {itemDesc}
            </p>
          )}

          {/* Price */}
          {itemPrice && (
            <p
              className="font-serif italic mb-5"
              style={{
                fontSize: "1.35rem",
                color: "var(--rose)",
              }}
            >
              {itemPrice}
            </p>
          )}

          {/* Products section */}
          {products.length > 0 && (
            <div className="mb-5">
              <p
                className="uppercase font-medium mb-2.5"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  color: "var(--muted-text)",
                }}
              >
                Products in this look
              </p>
              <div className="flex flex-col gap-0">
                {products.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2"
                    style={{
                      borderBottom:
                        idx < products.length - 1
                          ? "1px solid rgba(201, 137, 122, 0.12)"
                          : "none",
                    }}
                  >
                    <span
                      className="font-serif truncate mr-3"
                      style={{ fontSize: "0.82rem", color: "var(--text)" }}
                    >
                      {p.name}
                    </span>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex-shrink-0 uppercase tracking-wider font-medium transition-opacity hover:opacity-70"
                        style={{ fontSize: "0.65rem", color: "var(--rose)" }}
                      >
                        Shop →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shop CTA + Wishlist */}
          <div className="flex items-stretch gap-3 mb-5">
                {itemLink && (
                  <a
                    href={itemLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex-1 flex items-center justify-center rounded-lg font-medium transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: "var(--rose)",
                      color: "white",
                      fontSize: "0.85rem",
                      padding: "0.85rem 1.5rem",
                      boxShadow: "0 4px 12px rgba(201, 137, 122, 0.25)",
                    }}
                  >
                    🛍 Shop on Amazon
                  </a>
                )}

            <button
              className="flex items-center justify-center rounded-lg transition-all hover:scale-105"
              style={{
                width: "46px",
                height: "46px",
                border: "1.5px solid rgba(201, 137, 122, 0.3)",
                background: wished ? "var(--blush)" : "transparent",
                fontSize: "1.15rem",
                color: "var(--rose)",
                flexShrink: 0,
              }}
              onClick={toggleWish}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wished ? "♥" : "♡"}
            </button>
          </div>

          {/* Share row */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className="uppercase font-medium"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: "var(--muted-text)",
              }}
            >
              Share
            </span>
            <button
              onClick={sharePinterest}
              className="px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--surface)",
                fontSize: "0.68rem",
                color: "var(--text)",
              }}
              aria-label="Share on Pinterest"
            >
              Pinterest
            </button>
            <button
              onClick={shareWhatsApp}
              className="px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--surface)",
                fontSize: "0.68rem",
                color: "var(--text)",
              }}
              aria-label="Share on WhatsApp"
            >
              WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--surface)",
                fontSize: "0.68rem",
                color: "var(--text)",
              }}
              aria-label="Copy link"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* ─── Related Items Row ─── */}
        {relatedItems.length > 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              borderTop: "1px solid rgba(201, 137, 122, 0.1)",
            }}
            className="p-6 sm:px-8"
          >
            <p
              className="uppercase font-medium mb-3"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: "var(--muted-text)",
              }}
            >
              You May Also Like
            </p>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              {relatedItems.map((ri) => (
                <button
                  key={ri.id}
                  className="flex-shrink-0 text-left group/rel transition-transform hover:-translate-y-[3px]"
                  style={{ flex: "0 0 130px" }}
                  onClick={() =>
                    setQvItem({ ...ri, _type: type } as QVItem)
                  }
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden rounded-lg mb-1.5"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img
                      src={ri.img}
                      alt={ri.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = "none";
                        const ph = t.nextElementSibling as HTMLDivElement;
                        if (ph) ph.style.display = "flex";
                      }}
                    />
                    <div
                      className="w-full h-full items-center justify-center font-serif text-2xl absolute inset-0"
                      style={{
                        display: "none",
                        background: "var(--cream)",
                        color: "var(--rose)",
                      }}
                    >
                      {ri.title?.charAt(0) || "✦"}
                    </div>
                  </div>
                  <p
                    className="uppercase mb-0.5"
                    style={{
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      color: "var(--rose)",
                    }}
                  >
                    {ri.cat}
                  </p>
                  <p
                    className="font-serif truncate"
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 300,
                      color: "var(--text)",
                    }}
                  >
                    {ri.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Mobile override styles ─── */}
      <style jsx>{`
        @media (max-width: 640px) {
          .qv-up {
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            transform: none !important;
            max-width: 100% !important;
            width: 100% !important;
            max-height: 95vh !important;
            border-radius: 18px 18px 0 0 !important;
            grid-template-columns: 1fr !important;
          }
          .qv-up > div:first-child {
            min-height: 380px !important;
            position: relative !important;
            sticky: none !important;
          }

        }
      `}</style>

      {/* ─── Toast ─── */}
      {toast && (
        <div
          className="fixed z-[600] left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full font-medium"
          style={{
            bottom: "2rem",
            background: "var(--charcoal)",
            color: "white",
            fontSize: "0.82rem",
            animation: "qvFade 0.22s ease",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}

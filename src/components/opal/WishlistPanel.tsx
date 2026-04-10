"use client";

import { useAppStore } from "@/lib/store";
import { Heart, X, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export default function WishlistPanel() {
  const { wishlist, removeWishlistItem, setQvItem } = useAppStore();

  const closePanel = () => {
    const panel = document.getElementById("wishlist-panel");
    const overlay = document.getElementById("wishlist-overlay");
    if (panel) panel.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const panel = document.getElementById("wishlist-panel");
        if (panel?.classList.contains("open")) {
          closePanel();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        id="wishlist-overlay"
        className="fixed inset-0 z-[599] bg-black/30 hidden"
        onClick={closePanel}
        style={{ display: "none" }}
      />

      {/* Panel */}
      <div
        id="wishlist-panel"
        className="fixed top-0 right-[-420px] w-[400px] h-screen z-[600] flex flex-col transition-[right] duration-300 ease-in-out"
        style={{ background: "var(--bg)", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid rgba(201, 137, 122, 0.1)" }}
        >
          <h3
            className="font-serif text-[1.2rem]"
            style={{ color: "var(--text)" }}
          >
            Saved Items
          </h3>
          <button
            onClick={closePanel}
            className="p-1.5 rounded-full hover:bg-[var(--blush)] transition-colors"
          >
            <X size={18} style={{ color: "var(--muted-text)" }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <Heart
                size={40}
                style={{ color: "var(--light-muted)" }}
                className="mb-4"
              />
              <p
                className="font-serif italic text-[0.9rem]"
                style={{ color: "var(--light-muted)" }}
              >
                No saved items yet
              </p>
            </div>
          ) : (
            <div>
              {wishlist.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-3 p-4"
                  style={{
                    borderBottom: "1px solid rgba(201, 137, 122, 0.06)",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="flex-shrink-0 w-14 h-[70px] rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      closePanel();
                      setQvItem({
                        ...item,
                        _type: item.type,
                      } as never);
                    }}
                  >
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-serif italic text-sm"
                        style={{
                          background: "var(--blush)",
                          color: "var(--rose)",
                        }}
                      >
                        {item.title?.[0] || "✦"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[0.55rem] tracking-[0.15em] uppercase mb-0.5"
                      style={{ color: "var(--rose)" }}
                    >
                      {item.cat}
                    </p>
                    <p
                      className="text-[0.8rem] truncate mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      {item.title}
                    </p>
                    {item.price && (
                      <p
                        className="font-serif italic text-[0.8rem]"
                        style={{ color: "var(--rose)" }}
                      >
                        {item.price}
                      </p>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1 text-[0.65rem] mt-1 transition-colors"
                        style={{ color: "var(--rose)" }}
                      >
                        Shop
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeWishlistItem(item.key)}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-[var(--blush)] transition-colors"
                  >
                    <X size={14} style={{ color: "var(--light-muted)" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        #wishlist-overlay.open {
          display: block !important;
        }
        #wishlist-panel.open {
          right: 0 !important;
        }
        @media (max-width: 768px) {
          #wishlist-panel {
            width: 100% !important;
            right: -100% !important;
          }
          #wishlist-panel.open {
            right: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

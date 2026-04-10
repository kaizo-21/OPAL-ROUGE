"use client";

import { useAppStore } from "@/lib/store";

const EXPLORE_LINKS = [
  { id: "home", label: "Home" },
  { id: "outfits", label: "Outfit Ideas" },
  { id: "accessories", label: "Accessories" },
  { id: "shop", label: "Shop Looks" },
  { id: "trends", label: "Trend Guides" },
  { id: "about", label: "About" },
];

const DEFAULT_DISC = "Opal & Rouge participates in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in. As an Amazon Associate, we earn from qualifying purchases.";

export default function Footer() {
  const { setCurrentPage, currentPage, siteSettings } = useAppStore();

  return (
    <footer style={{ background: "#2A2220" }}>
      {/* Main Footer Content */}
      <div
        className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        style={{ maxWidth: "1440px", padding: "3rem 2rem" }}
      >
        {/* Brand Column */}
        <div>
          <h3
            className="font-serif italic text-[1.42rem] tracking-wide mb-4"
            style={{ color: "var(--rose)" }}
          >
            Opal & Rouge
          </h3>
          <p
            className="text-[0.78rem] leading-[1.8]"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            Curated fashion inspiration, outfit ideas, and elegant style guides
            — handpicked for the modern woman who values timeless elegance.
          </p>
        </div>

        {/* Explore Column */}
        <div>
          <h4
            className="text-[0.7rem] tracking-[0.15em] uppercase mb-4 font-medium"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Explore
          </h4>
          <ul className="space-y-2.5">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => setCurrentPage(link.id)}
                  className="text-[0.78rem] transition-colors hover:text-white"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#C9897A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")
                  }
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4
            className="text-[0.7rem] tracking-[0.15em] uppercase mb-4 font-medium"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Company
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => setCurrentPage("about")}
                className="text-[0.78rem] transition-colors"
                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#C9897A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")
                }
              >
                About
              </button>
            </li>
            <li>
              <a
                href="https://in.pinterest.com/opalrougeoutfits/"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-[0.78rem] transition-colors inline-flex items-center gap-1"
                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#C9897A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")
                }
              >
                Pinterest ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Column */}
        <div>
          <h4
            className="text-[0.7rem] tracking-[0.15em] uppercase mb-4 font-medium"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Follow
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a
                href="https://in.pinterest.com/opalrougeoutfits/"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-[0.78rem] transition-colors inline-flex items-center gap-1.5"
                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#C9897A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")
                }
              >
                Pinterest
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Amazon Associates Disclosure */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "1440px",
          padding: "0 2rem 2rem",
        }}
      >
        <div
          className="mb-4"
          style={{
            height: "1px",
            background: "rgba(201, 137, 122, 0.1)",
          }}
        />
        <p
          className="text-[0.7rem] leading-[1.7]"
          style={{ color: "rgba(255, 255, 255, 0.4)" }}
        >
          {siteSettings.disc || DEFAULT_DISC}
        </p>
      </div>

      {/* Mini Footer Bar */}
      {currentPage !== "home" && (
        <div
          style={{
            borderTop: "1px solid rgba(201, 137, 122, 0.06)",
            padding: "0.75rem 2rem",
          }}
        >
          <p
            className="text-center text-[0.65rem]"
            style={{ color: "rgba(255, 255, 255, 0.3)" }}
          >
            Opal & Rouge participates in the Amazon Associates Program.
          </p>
        </div>
      )}
    </footer>
  );
}

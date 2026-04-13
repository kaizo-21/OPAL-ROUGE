"use client";

import { useAppStore } from "@/lib/store";
import { Heart, Moon, Sun, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "outfits", label: "Outfit Ideas", href: "/outfit-ideas" },
  { id: "accessories", label: "Accessories", href: "/accessories" },
  { id: "shop", label: "Shop Looks", href: "/shop-looks" },
  { id: "trends", label: "Trend Guides", href: "/trend-guides" },
  { id: "about", label: "About", href: "/about" },
];

export default function Navigation() {
  const {
    theme,
    setTheme,
    wishlist,
    setIsAdminOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useAppStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("opr_theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, [setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsAdminOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const wishlistCount = wishlist.length;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[300] transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(201, 137, 122, 0.1)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[62px]">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-[1.42rem] italic tracking-wide hover:opacity-80 transition-opacity"
            style={{ color: "var(--rose)" }}
          >
            Opal & Rouge
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-link text-[0.72rem] tracking-[0.1em] uppercase font-light transition-colors ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    color: isActive ? "var(--rose)" : "var(--text)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--blush)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={18} style={{ color: "var(--muted-text)" }} />
              ) : (
                <Sun size={18} style={{ color: "var(--muted-text)" }} />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                const panel = document.getElementById("wishlist-panel");
                const overlay = document.getElementById("wishlist-overlay");
                if (panel) panel.classList.add("open");
                if (overlay) overlay.classList.add("open");
              }}
              className="p-2 rounded-full hover:bg-[var(--blush)] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={18} style={{ color: "var(--muted-text)" }} />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[0.55rem] flex items-center justify-center font-medium"
                  style={{ background: "var(--rose)" }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shop CTA (desktop) */}
            <Link
              href="/shop-looks"
              className="hidden md:flex items-center gap-1.5 text-[0.68rem] tracking-[0.1em] uppercase px-4 py-2 rounded-full text-white transition-all hover:-translate-y-0.5"
              style={{ background: "var(--rose)" }}
            >
              <ShoppingBag size={14} />
              Shop the Look
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col gap-[5px] items-center justify-center w-6 h-6"
              aria-label="Menu"
            >
              <span
                className="block w-full h-[2px] rounded-full transition-all duration-300 origin-center"
                style={{
                  background: "var(--text)",
                  transform: isMobileMenuOpen ? "rotate(45deg) translateY(3.5px)" : "none",
                }}
              />
              <span
                className="block w-full h-[2px] rounded-full transition-all duration-300"
                style={{
                  background: "var(--text)",
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-full h-[2px] rounded-full transition-all duration-300 origin-center"
                style={{
                  background: "var(--text)",
                  transform: isMobileMenuOpen ? "rotate(-45deg) translateY(-3.5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-[62px] left-0 right-0 z-[299] flex flex-col md:hidden"
          style={{
            background: "var(--bg)",
            borderBottom: "1px solid rgba(201, 137, 122, 0.08)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left px-6 py-4 text-[0.78rem] tracking-[0.08em] uppercase font-light transition-colors hover:bg-[var(--blush)]"
                style={{
                  color: isActive ? "var(--rose)" : "var(--text)",
                  borderBottom: "1px solid rgba(201, 137, 122, 0.08)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

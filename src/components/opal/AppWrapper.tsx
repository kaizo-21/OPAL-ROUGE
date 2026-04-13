"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { subscribeToItems, getSettings } from "@/lib/firebase-service";
import Navigation from "@/components/opal/Navigation";
import Footer from "@/components/opal/Footer";
import QuickView from "@/components/opal/QuickView";
import WishlistPanel from "@/components/opal/WishlistPanel";
import AdminPanel from "@/components/opal/AdminPanel";
import Toast from "@/components/opal/Toast";
import BackToTop from "@/components/opal/BackToTop";
import { usePathname } from "next/navigation";
import {
  OutfitItem,
  AccessoryItem,
  ShopLookItem,
  TrendGuideItem,
} from "@/lib/types";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const {
    setOutfits,
    setAccessories,
    setShop,
    setTrends,
    setLoading,
    setWishlist,
    setSiteSettings,
    setTheme,
    setIsMobileMenuOpen,
  } = useAppStore();

  const pathname = usePathname();

  // Initialize Firebase real-time listeners
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    const unsubOutfits = subscribeToItems<OutfitItem>("outfits", (items) => {
      setOutfits(items);
    });
    unsubs.push(unsubOutfits);

    const unsubAccessories = subscribeToItems<AccessoryItem>(
      "accessories",
      (items) => {
        setAccessories(items);
      }
    );
    unsubs.push(unsubAccessories);

    const unsubShop = subscribeToItems<ShopLookItem>("shop", (items) => {
      setShop(items);
    });
    unsubs.push(unsubShop);

    const unsubTrends = subscribeToItems<TrendGuideItem>("trends", (items) => {
      setTrends(items);
    });
    unsubs.push(unsubTrends);

    // Load settings from Firebase
    getSettings().then((s) => {
      setSiteSettings({
        ofLim: parseInt(s.ofLim || "6", 10),
        acLim: parseInt(s.acLim || "8", 10),
        disc: s.disc || "",
      });
    });

    setLoading(false);

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [setOutfits, setAccessories, setShop, setTrends, setLoading, setSiteSettings]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("opr_wl");
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, [setWishlist]);

  // Load theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("opr_theme");
      if (saved === "dark") {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, [setTheme]);

  // Close mobile menu and scroll to top on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, setIsMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuickView />
      <WishlistPanel />
      <AdminPanel />
      <Toast />
      <BackToTop />
    </div>
  );
}

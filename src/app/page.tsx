"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { subscribeToItems, getSettings } from "@/lib/firebase-service";
import Navigation from "@/components/opal/Navigation";
import HomePage from "@/components/opal/HomePage";
import OutfitsPage from "@/components/opal/OutfitsPage";
import AccessoriesPage from "@/components/opal/AccessoriesPage";
import ShopPage from "@/components/opal/ShopPage";
import TrendsPage from "@/components/opal/TrendsPage";
import AboutPage from "@/components/opal/AboutPage";
import Footer from "@/components/opal/Footer";
import QuickView from "@/components/opal/QuickView";
import WishlistPanel from "@/components/opal/WishlistPanel";
import AdminPanel from "@/components/opal/AdminPanel";
import BlogArticle from "@/components/opal/BlogArticle";
import Toast from "@/components/opal/Toast";
import BackToTop from "@/components/opal/BackToTop";
import {
  OutfitItem,
  AccessoryItem,
  ShopLookItem,
  TrendGuideItem,
  ContentType,
} from "@/lib/types";

export default function Home() {
  const {
    currentPage,
    blogItem,
    setCurrentPage,
    setOutfits,
    setAccessories,
    setShop,
    setTrends,
    setLoading,
    setWishlist,
    setSiteSettings,
  } = useAppStore();

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

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Load theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("opr_theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const renderPage = () => {
    if (blogItem) return <BlogArticle />;

    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "outfits":
        return <OutfitsPage />;
      case "accessories":
        return <AccessoriesPage />;
      case "shop":
        return <ShopPage />;
      case "trends":
        return <TrendsPage />;
      case "about":
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <QuickView />
      <WishlistPanel />
      <AdminPanel />
      <Toast />
      <BackToTop />
    </div>
  );
}

import { create } from "zustand";
import {
  OutfitItem,
  AccessoryItem,
  ShopLookItem,
  TrendGuideItem,
  ContentType,
  WishlistItem,
  FilterState,
} from "./types";

interface AppState {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Data
  outfits: OutfitItem[];
  accessories: AccessoryItem[];
  shop: ShopLookItem[];
  trends: TrendGuideItem[];
  setOutfits: (items: OutfitItem[]) => void;
  setAccessories: (items: AccessoryItem[]) => void;
  setShop: (items: ShopLookItem[]) => void;
  setTrends: (items: TrendGuideItem[]) => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Wishlist
  wishlist: WishlistItem[];
  setWishlist: (items: WishlistItem[]) => void;
  addWishlistItem: (item: WishlistItem) => void;
  removeWishlistItem: (key: string) => void;
  isWished: (id: string, type: ContentType) => boolean;

  // Filters
  filters: Record<ContentType, FilterState>;
  setFilter: (type: ContentType, filter: Partial<FilterState>) => void;

  // Quick View
  qvItem: (OutfitItem | AccessoryItem | ShopLookItem | TrendGuideItem) & { _type?: ContentType } | null;
  setQvItem: (item: (OutfitItem | AccessoryItem | ShopLookItem | TrendGuideItem) & { _type?: ContentType } | null) => void;

  // Admin
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuth: boolean;
  setIsAdminAuth: (auth: boolean) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Blog
  blogItem: (OutfitItem | ShopLookItem) & { _type: ContentType } | null;
  setBlogItem: (item: (OutfitItem | ShopLookItem) & { _type: ContentType } | null) => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Loading
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Settings (from Firebase)
  siteSettings: { ofLim: number; acLim: number; disc: string };
  setSiteSettings: (settings: { ofLim: number; acLim: number; disc: string }) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page, isMobileMenuOpen: false }),

  // Data
  outfits: [],
  accessories: [],
  shop: [],
  trends: [],
  setOutfits: (items) => set({ outfits: items }),
  setAccessories: (items) => set({ accessories: items }),
  setShop: (items) => set({ shop: items }),
  setTrends: (items) => set({ trends: items }),

  // Theme
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("opr_theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  },

  // Wishlist
  wishlist: [],
  setWishlist: (items) => set({ wishlist: items }),
  addWishlistItem: (item) => {
    const wishlist = get().wishlist;
    if (!wishlist.find((w) => w.key === item.key)) {
      const newWishlist = [...wishlist, item];
      set({ wishlist: newWishlist });
      if (typeof window !== "undefined") {
        localStorage.setItem("opr_wl", JSON.stringify(newWishlist));
      }
    }
  },
  removeWishlistItem: (key) => {
    const newWishlist = get().wishlist.filter((w) => w.key !== key);
    set({ wishlist: newWishlist });
    if (typeof window !== "undefined") {
      localStorage.setItem("opr_wl", JSON.stringify(newWishlist));
    }
  },
  isWished: (id, type) => {
    return get().wishlist.some((w) => w.key === `${type}:${id}`);
  },

  // Filters
  filters: {
    outfits: { cat: "All", q: "", sort: "newest" },
    accessories: { cat: "All", q: "", sort: "newest" },
    shop: { cat: "All", q: "", sort: "newest" },
    trends: { cat: "All", q: "", sort: "newest" },
  },
  setFilter: (type, filter) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [type]: { ...state.filters[type], ...filter },
      },
    })),

  // Quick View
  qvItem: null,
  setQvItem: (item) => set({ qvItem: item }),

  // Admin
  isAdminOpen: false,
  setIsAdminOpen: (open) => set({ isAdminOpen: open }),
  isAdminAuth: false,
  setIsAdminAuth: (auth) => set({ isAdminAuth: auth }),
  adminTab: "outfits",
  setAdminTab: (tab) => set({ adminTab: tab }),

  // Blog
  blogItem: null,
  setBlogItem: (item) => set({ blogItem: item }),

  // Mobile menu
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  // Loading
  loading: true,
  setLoading: (loading) => set({ loading }),

  // Settings
  siteSettings: { ofLim: 6, acLim: 8, disc: "" },
  setSiteSettings: (settings) => set({ siteSettings: settings }),
}));

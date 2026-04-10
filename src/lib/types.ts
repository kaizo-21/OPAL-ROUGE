export interface OutfitItem {
  id: string;
  title: string;
  cat: string;
  img: string;
  desc: string;
  link: string;
  featured: string;
  date: string;
}

export interface AccessoryItem {
  id: string;
  title: string;
  cat: string;
  img: string;
  link: string;
  price: string;
  badge: string;
  desc: string;
  featured: string;
  date: string;
}

export interface ShopLookItem {
  id: string;
  title: string;
  cat: string;
  img: string;
  products: string;
  date: string;
}

export interface TrendGuideItem {
  id: string;
  title: string;
  cat: string;
  img: string;
  desc: string;
  link: string;
  date: string;
}

export type ContentType = "outfits" | "accessories" | "shop" | "trends";

export type ContentItem = OutfitItem | AccessoryItem | ShopLookItem | TrendGuideItem;

export interface WishlistItem {
  key: string;
  type: ContentType;
  id: string;
  title: string;
  cat: string;
  img: string;
  link: string;
  price?: string;
}

export interface FilterState {
  cat: string;
  q: string;
  sort: string;
}

export interface SiteSettings {
  ofLim: number;
  acLim: number;
  disc: string;
}

export const OUTFIT_CATEGORIES = [
  "Office Wear",
  "Festive & Eid",
  "Career Fair",
  "Street Style",
  "Casual",
  "Cultural Fashion",
  "Spring Style",
  "Formal",
  "Outdoor & Sport",
];

export const ACCESSORY_CATEGORIES = [
  "Necklaces",
  "Rings",
  "Earrings",
  "Waist Chains",
  "Bags",
  "Watches",
  "Sunglasses",
  "Bracelets",
  "Anklets",
];

export const SHOP_CATEGORIES = [
  "Office Wear",
  "Festive",
  "Casual",
  "Evening",
  "Street Style",
  "Formal",
];

export const TREND_CATEGORIES = [
  "Office Style",
  "Accessories",
  "Festive",
  "Seasonal",
  "Minimalism",
  "Global Fashion",
];

"use client";

import { useAppStore } from "@/lib/store";
import {
  OutfitItem,
  AccessoryItem,
  ShopLookItem,
  TrendGuideItem,
  ContentType,
  OUTFIT_CATEGORIES,
  ACCESSORY_CATEGORIES,
  SHOP_CATEGORIES,
  TREND_CATEGORIES,
} from "@/lib/types";
import {
  addItem,
  updateItem,
  deleteItem,
  bulkDeleteItems,
  reorderItems,
  getAdminPassword,
  setAdminPassword,
  getSettings,
  saveSettings,
} from "@/lib/firebase-service";
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Download,
  Upload,
  Settings,
  Eye,
  Edit3,
  Save,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { showToast } from "@/components/opal/Toast";

const ADMIN_BG = "#0F1117";
const ADMIN_CARD = "#161920";
const ADMIN_ACCENT = "#C9897A";
const ADMIN_BORDER = "rgba(201, 137, 122, 0.15)";
const ADMIN_TEXT = "#E8E0D8";

const TABS = [
  { id: "outfits", label: "Outfit Posts" },
  { id: "accessories", label: "Accessories" },
  { id: "shop", label: "Shop the Look" },
  { id: "trends", label: "Trend Guides" },
  { id: "settings", label: "Settings" },
];

const CATEGORY_MAP: Record<string, string[]> = {
  outfits: OUTFIT_CATEGORIES,
  accessories: ACCESSORY_CATEGORIES,
  shop: SHOP_CATEGORIES,
  trends: TREND_CATEGORIES,
};

export default function AdminPanel() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuth,
    setIsAdminAuth,
    adminTab,
    setAdminTab,
    outfits,
    accessories,
    shop,
    trends,
    setOutfits,
    setAccessories,
    setShop,
    setTrends,
    setSiteSettings,
  } = useAppStore();

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [settings, setSettingsState] = useState({
    ofLim: "6",
    acLim: "8",
    disc: "",
  });
  const [pwForm, setPwForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for each content type
  const [outfitForm, setOutfitForm] = useState({
    title: "",
    cat: OUTFIT_CATEGORIES[0],
    img: "",
    desc: "",
    link: "",
    featured: "yes",
  });
  const [accessoryForm, setAccessoryForm] = useState({
    title: "",
    cat: ACCESSORY_CATEGORIES[0],
    img: "",
    link: "",
    price: "",
    badge: "",
    desc: "",
    featured: "yes",
  });
  const [shopForm, setShopForm] = useState({
    title: "",
    cat: SHOP_CATEGORIES[0],
    img: "",
    products: "",
  });
  const [trendForm, setTrendForm] = useState({
    title: "",
    cat: TREND_CATEGORIES[0],
    img: "",
    desc: "",
    link: "",
  });

  // Load settings on auth
  useEffect(() => {
    if (isAdminAuth) {
      getSettings().then((s) => {
        setSettingsState({
          ofLim: s.ofLim || "6",
          acLim: s.acLim || "8",
          disc: s.disc || "",
        });
      });
    }
  }, [isAdminAuth]);

  const closeAdmin = () => {
    setIsAdminOpen(false);
    setIsAdminAuth(false);
    document.body.style.overflow = "";
    setEditingId(null);
    setSelectedIds([]);
  };

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAdminOpen) {
        closeAdmin();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isAdminOpen]);

  const handleLogin = async () => {
    const adminPw = await getAdminPassword();
    if (password === adminPw) {
      setIsAdminAuth(true);
      setLoginError(false);
      setPassword("");
    } else {
      setLoginError(true);
    }
  };

  const getData = useCallback(
    (type: ContentType) => {
      switch (type) {
        case "outfits":
          return outfits;
        case "accessories":
          return accessories;
        case "shop":
          return shop;
        case "trends":
          return trends;
      }
    },
    [outfits, accessories, shop, trends]
  );

  const setData = useCallback(
    (type: ContentType, items: unknown[]) => {
      switch (type) {
        case "outfits":
          setOutfits(items as OutfitItem[]);
          break;
        case "accessories":
          setAccessories(items as AccessoryItem[]);
          break;
        case "shop":
          setShop(items as ShopLookItem[]);
          break;
        case "trends":
          setTrends(items as TrendGuideItem[]);
          break;
      }
    },
    [setOutfits, setAccessories, setShop, setTrends]
  );

  const getForm = (type: ContentType) => {
    switch (type) {
      case "outfits":
        return outfitForm;
      case "accessories":
        return accessoryForm;
      case "shop":
        return shopForm;
      case "trends":
        return trendForm;
    }
  };

  const setForm = (type: ContentType, data: Record<string, string>) => {
    switch (type) {
      case "outfits":
        setOutfitForm(data as typeof outfitForm);
        break;
      case "accessories":
        setAccessoryForm(data as typeof accessoryForm);
        break;
      case "shop":
        setShopForm(data as typeof shopForm);
        break;
      case "trends":
        setTrendForm(data as typeof trendForm);
        break;
    }
  };

  const resetForm = (type: ContentType) => {
    switch (type) {
      case "outfits":
        setOutfitForm({
          title: "",
          cat: OUTFIT_CATEGORIES[0],
          img: "",
          desc: "",
          link: "",
          featured: "yes",
        });
        break;
      case "accessories":
        setAccessoryForm({
          title: "",
          cat: ACCESSORY_CATEGORIES[0],
          img: "",
          link: "",
          price: "",
          badge: "",
          desc: "",
          featured: "yes",
        });
        break;
      case "shop":
        setShopForm({
          title: "",
          cat: SHOP_CATEGORIES[0],
          img: "",
          products: "",
        });
        break;
      case "trends":
        setTrendForm({
          title: "",
          cat: TREND_CATEGORIES[0],
          img: "",
          desc: "",
          link: "",
        });
        break;
    }
    setEditingId(null);
  };

  const handleSave = async (type: ContentType) => {
    const form = getForm(type);
    if (!form.title.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateItem(type, editingId, form as Record<string, string>);
      } else {
        await addItem(type, form as Record<string, string>);
      }
      resetForm(type);
    } catch (err) {
      console.error("Save error:", err);
    }
    setSaving(false);
  };

  const handleEdit = (type: ContentType, item: Record<string, string>) => {
    setEditingId(item.id);
    const { id, date, createdAt, ...formData } = item;
    setForm(type, formData);
  };

  const handleDelete = async (type: ContentType, id: string) => {
    if (!confirm("Delete this item?")) return;
    await deleteItem(type, id);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleBulkDelete = async (type: ContentType) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected items?`)) return;
    await bulkDeleteItems(type, selectedIds);
    setSelectedIds([]);
  };

  const handleExport = () => {
    const data = {
      outfits,
      accessories,
      shop,
      trends,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "opal-rouge-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.outfits) setOutfits(data.outfits);
        if (data.accessories) setAccessories(data.accessories);
        if (data.shop) setShop(data.shop);
        if (data.trends) setTrends(data.trends);
        // Import items to Firebase
        for (const type of ["outfits", "accessories", "shop", "trends"] as ContentType[]) {
          const items = data[type] || [];
          for (const item of items) {
            const { id, date, createdAt, ...formData } = item;
            await addItem(type, formData);
          }
        }
      } catch {
        console.error("Import error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSaveSettings = async () => {
    await saveSettings(settings as unknown as Record<string, string>);
    setSiteSettings({
      ofLim: parseInt(settings.ofLim || "6", 10),
      acLim: parseInt(settings.acLim || "8", 10),
      disc: settings.disc || "",
    });
    showToast("Settings saved ✦");
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (pwForm.new.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      setPwError("Passwords do not match");
      return;
    }
    const currentPw = await getAdminPassword();
    if (pwForm.current !== currentPw) {
      setPwError("Current password is incorrect");
      return;
    }
    await setAdminPassword(pwForm.new);
    setPwForm({ current: "", new: "", confirm: "" });
  };

  if (!isAdminOpen) return null;

  // Login Screen
  if (!isAdminAuth) {
    return (
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center"
        style={{ background: ADMIN_BG }}
      >
        <div
          className="w-full max-w-md p-8 rounded-2xl"
          style={{ background: ADMIN_CARD, border: `1px solid ${ADMIN_BORDER}` }}
        >
          <h2
            className="font-serif text-2xl italic mb-2 text-center"
            style={{ color: ADMIN_ACCENT }}
          >
            Opal & Rouge
          </h2>
          <p
            className="text-center text-[0.75rem] tracking-wider uppercase mb-8"
            style={{ color: "rgba(232,224,216,0.5)" }}
          >
            Admin Panel
          </p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-lg text-sm mb-3 outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${ADMIN_BORDER}`,
              color: ADMIN_TEXT,
            }}
          />
          {loginError && (
            <p className="text-[0.75rem] mb-3" style={{ color: "#e53e3e" }}>
              Incorrect password.
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg text-sm font-medium tracking-wider uppercase text-white transition-opacity hover:opacity-90"
            style={{ background: ADMIN_ACCENT }}
          >
            Enter Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // Dashboard
  const currentData = getData(adminTab as ContentType) || [];

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{ background: ADMIN_BG }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${ADMIN_BORDER}` }}
      >
        <h3
          className="font-serif text-lg italic"
          style={{ color: ADMIN_ACCENT }}
        >
          Opal & Rouge Admin
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.7rem] tracking-wider uppercase transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: ADMIN_TEXT,
              border: `1px solid ${ADMIN_BORDER}`,
            }}
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.7rem] tracking-wider uppercase transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: ADMIN_TEXT,
              border: `1px solid ${ADMIN_BORDER}`,
            }}
          >
            <Upload size={14} />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={closeAdmin}
            className="p-2 rounded-full transition-colors"
            style={{ color: ADMIN_TEXT }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4"
      >
        {[
          { label: "Outfit Posts", count: outfits.length, id: "s-o" },
          { label: "Accessories", count: accessories.length, id: "s-a" },
          { label: "Shop Looks", count: shop.length, id: "s-s" },
          { label: "Trend Guides", count: trends.length, id: "s-t" },
        ].map((stat) => (
          <div
            key={stat.id}
            className="p-4 rounded-xl text-center"
            style={{
              background: ADMIN_CARD,
              border: `1px solid ${ADMIN_BORDER}`,
            }}
          >
            <p
              className="font-serif text-2xl italic"
              style={{ color: ADMIN_ACCENT }}
            >
              {stat.count}
            </p>
            <p
              className="text-[0.6rem] tracking-[0.12em] uppercase mt-1"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div
        className="flex gap-1 px-6 overflow-x-auto"
        style={{ borderBottom: `1px solid ${ADMIN_BORDER}` }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setAdminTab(tab.id);
              setEditingId(null);
              setSelectedIds([]);
            }}
            className="px-4 py-3 text-[0.7rem] tracking-wider uppercase whitespace-nowrap transition-colors"
            style={{
              color: adminTab === tab.id ? ADMIN_ACCENT : "rgba(232,224,216,0.5)",
              borderBottom:
                adminTab === tab.id
                  ? `2px solid ${ADMIN_ACCENT}`
                  : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {adminTab === "settings" ? (
          <SettingsPanel
            settings={settings}
            setSettings={setSettingsState}
            onSave={handleSaveSettings}
            pwForm={pwForm}
            setPwForm={setPwForm}
            pwError={pwError}
            onChangePassword={handleChangePassword}
            onExport={handleExport}
          />
        ) : (
          <ContentTab
            type={adminTab as ContentType}
            items={currentData as Record<string, string>[]}
            form={getForm(adminTab as ContentType) as Record<string, string>}
            editingId={editingId}
            selectedIds={selectedIds}
            saving={saving}
            onSave={() => handleSave(adminTab as ContentType)}
            onEdit={(item) => handleEdit(adminTab as ContentType, item)}
            onDelete={(id) => handleDelete(adminTab as ContentType, id)}
            onBulkDelete={() => handleBulkDelete(adminTab as ContentType)}
            onCancelEdit={() => resetForm(adminTab as ContentType)}
            onFormChange={(field, value) => {
              const form = getForm(adminTab as ContentType);
              setForm(adminTab as ContentType, {
                ...form,
                [field]: value,
              } as Record<string, string>);
            }}
            onToggleSelect={(id) => {
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((i) => i !== id)
                  : [...prev, id]
              );
            }}
            onReorder={(reordered) => {
              setData(adminTab as ContentType, reordered);
              reorderItems(
                adminTab as ContentType,
                reordered.map((item, index) => ({ id: item.id, order: index }))
              );
              showToast("Reordered ✦");
            }}
            categories={CATEGORY_MAP[adminTab] || []}
          />
        )}
      </div>
    </div>
  );
}

// =====================
// Content Tab Component
// =====================
function ContentTab({
  type,
  items,
  form,
  editingId,
  selectedIds,
  saving,
  onSave,
  onEdit,
  onDelete,
  onBulkDelete,
  onCancelEdit,
  onFormChange,
  onToggleSelect,
  onReorder,
  categories,
}: {
  type: ContentType;
  items: Record<string, string>[];
  form: Record<string, string>;
  editingId: string | null;
  selectedIds: string[];
  saving: boolean;
  onSave: () => void;
  onEdit: (item: Record<string, string>) => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  onCancelEdit: () => void;
  onFormChange: (field: string, value: string) => void;
  onToggleSelect: (id: string) => void;
  onReorder: (items: Record<string, string>[]) => void;
  categories: string[];
}) {
  const isOutfit = type === "outfits";
  const isAccessory = type === "accessories";
  const isShop = type === "shop";
  const isTrend = type === "trends";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: ADMIN_CARD,
          border: `1px solid ${ADMIN_BORDER}`,
        }}
      >
        <h4
          className="text-[0.75rem] tracking-wider uppercase mb-5 flex items-center gap-2"
          style={{ color: ADMIN_ACCENT }}
        >
          {editingId ? (
            <Edit3 size={14} />
          ) : (
            <Plus size={14} />
          )}
          {editingId ? "Edit Item" : "Add New"}
        </h4>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label
              className="text-[0.6rem] tracking-wider uppercase mb-1 block"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              {isShop ? "Look Name" : isTrend ? "Guide Title" : isAccessory ? "Product Name" : "Title"} *
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => onFormChange("title", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ADMIN_BORDER}`,
                color: ADMIN_TEXT,
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="text-[0.6rem] tracking-wider uppercase mb-1 block"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              {isShop ? "Style Tag" : isTrend ? "Topic Tag" : "Category"} *
            </label>
            <select
              value={form.cat || categories[0]}
              onChange={(e) => onFormChange("cat", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ADMIN_BORDER}`,
                color: ADMIN_TEXT,
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label
              className="text-[0.6rem] tracking-wider uppercase mb-1 block"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              Image URL
            </label>
            <input
              type="text"
              value={form.img || ""}
              onChange={(e) => onFormChange("img", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ADMIN_BORDER}`,
                color: ADMIN_TEXT,
              }}
            />
            {form.img && (
              <div className="mt-2 rounded-lg overflow-hidden max-h-[140px]">
                <img
                  src={form.img}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className="text-[0.6rem] tracking-wider uppercase mb-1 block"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              {isOutfit ? "Description / Styling Tip" : isTrend ? "Summary" : "Description"}
            </label>
            <textarea
              value={form.desc || ""}
              onChange={(e) => onFormChange("desc", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ADMIN_BORDER}`,
                color: ADMIN_TEXT,
              }}
            />
          </div>

          {/* Link (outfits, accessories, trends) */}
          {!isShop && (
            <div>
              <label
                className="text-[0.6rem] tracking-wider uppercase mb-1 block"
                style={{ color: "rgba(232,224,216,0.5)" }}
              >
                {isTrend ? "External Link" : "Amazon / Shop Link"}
              </label>
              <input
                type="text"
                value={form.link || ""}
                onChange={(e) => onFormChange("link", e.target.value)}
                placeholder="https://amazon.in/..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${ADMIN_BORDER}`,
                  color: ADMIN_TEXT,
                }}
              />
            </div>
          )}

          {/* Price (accessories only) */}
          {isAccessory && (
            <div>
              <label
                className="text-[0.6rem] tracking-wider uppercase mb-1 block"
                style={{ color: "rgba(232,224,216,0.5)" }}
              >
                Price
              </label>
              <input
                type="text"
                value={form.price || ""}
                onChange={(e) => onFormChange("price", e.target.value)}
                placeholder="₹599"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${ADMIN_BORDER}`,
                  color: ADMIN_TEXT,
                }}
              />
            </div>
          )}

          {/* Badge (accessories only) */}
          {isAccessory && (
            <div>
              <label
                className="text-[0.6rem] tracking-wider uppercase mb-1 block"
                style={{ color: "rgba(232,224,216,0.5)" }}
              >
                Badge
              </label>
              <input
                type="text"
                value={form.badge || ""}
                onChange={(e) => onFormChange("badge", e.target.value)}
                placeholder="Bestseller, New, Sale"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${ADMIN_BORDER}`,
                  color: ADMIN_TEXT,
                }}
              />
            </div>
          )}

          {/* Products (shop only) */}
          {isShop && (
            <div>
              <label
                className="text-[0.6rem] tracking-wider uppercase mb-1 block"
                style={{ color: "rgba(232,224,216,0.5)" }}
              >
                Products (one per line: Name | URL)
              </label>
              <textarea
                value={form.products || ""}
                onChange={(e) => onFormChange("products", e.target.value)}
                rows={4}
                placeholder="Product Name | https://amazon.in/..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${ADMIN_BORDER}`,
                  color: ADMIN_TEXT,
                }}
              />
            </div>
          )}

          {/* Featured (outfits, accessories) */}
          {(isOutfit || isAccessory) && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured !== "no"}
                onChange={(e) =>
                  onFormChange("featured", e.target.checked ? "yes" : "no")
                }
                className="rounded"
              />
              <label
                className="text-[0.65rem] tracking-wider uppercase"
                style={{ color: "rgba(232,224,216,0.5)" }}
              >
                Show on Homepage
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onSave}
              disabled={saving || !form.title.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.7rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: ADMIN_ACCENT }}
            >
              <Save size={14} />
              {saving ? "Saving..." : editingId ? "Update" : "Add Item"}
            </button>
            {editingId && (
              <button
                onClick={onCancelEdit}
                className="px-4 py-2.5 rounded-lg text-[0.7rem] tracking-wider uppercase transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: ADMIN_TEXT,
                  border: `1px solid ${ADMIN_BORDER}`,
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Item List */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: ADMIN_CARD,
          border: `1px solid ${ADMIN_BORDER}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4
            className="text-[0.75rem] tracking-wider uppercase"
            style={{ color: ADMIN_ACCENT }}
          >
            Items ({items.length})
          </h4>
          {selectedIds.length > 0 && (
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.65rem] tracking-wider uppercase transition-colors"
              style={{
                background: "rgba(229,62,62,0.15)",
                color: "#e53e3e",
                border: "1px solid rgba(229,62,62,0.3)",
              }}
            >
              <Trash2 size={12} />
              Delete {selectedIds.length} Selected
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p
            className="text-center py-10 text-[0.8rem] italic"
            style={{ color: "rgba(232,224,216,0.3)" }}
          >
            No items yet. Add your first item using the form.
          </p>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event: DragEndEvent) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              const oldIndex = items.findIndex((i) => i.id === active.id);
              const newIndex = items.findIndex((i) => i.id === over.id);
              if (oldIndex === -1 || newIndex === -1) return;
              const reordered = [...items];
              const [moved] = reordered.splice(oldIndex, 1);
              reordered.splice(newIndex, 0, moved);
              onReorder(reordered);
            }}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id}>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors group"
                      style={{
                        background: editingId === item.id ? "rgba(201,137,122,0.1)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${
                          editingId === item.id ? ADMIN_ACCENT : ADMIN_BORDER
                        }`,
                      }}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => onToggleSelect(item.id)}
                        className="rounded flex-shrink-0"
                      />

                      {/* Drag handle */}
                      <SortableDragHandle />

                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden">
                        {item.img ? (
                          <img
                            src={item.img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center font-serif italic text-xs"
                            style={{
                              background: "rgba(201,137,122,0.15)",
                              color: ADMIN_ACCENT,
                            }}
                          >
                            {item.title?.[0] || "✦"}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[0.78rem] truncate"
                          style={{ color: ADMIN_TEXT }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="text-[0.6rem] tracking-wider uppercase"
                          style={{ color: "rgba(232,224,216,0.4)" }}
                        >
                          {item.cat} {item.date ? `· ${item.date}` : ""}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-md transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: ADMIN_ACCENT,
                          }}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 rounded-md transition-colors"
                          style={{
                            background: "rgba(229,62,62,0.1)",
                            color: "#e53e3e",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// =====================
// Sortable Item Wrapper
// =====================
const SortableItemContext = createContext<{
  listeners: Record<string, unknown>;
  attributes: Record<string, unknown>;
}>({ listeners: {}, attributes: {} });

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <SortableItemContext.Provider value={{ listeners, attributes }}>
      <div ref={setNodeRef} style={style} {...attributes}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

function SortableDragHandle() {
  const { listeners } = useContext(SortableItemContext);
  return (
    <span className="flex-shrink-0 cursor-grab touch-none" {...listeners}>
      <GripVertical
        size={14}
        style={{ color: "rgba(232,224,216,0.2)" }}
      />
    </span>
  );
}

// =====================
// Settings Panel
// =====================
function SettingsPanel({
  settings,
  setSettings,
  onSave,
  pwForm,
  setPwForm,
  pwError,
  onChangePassword,
  onExport,
}: {
  settings: { ofLim: string; acLim: string; disc: string };
  setSettings: (s: { ofLim: string; acLim: string; disc: string }) => void;
  onSave: () => void;
  pwForm: { current: string; new: string; confirm: string };
  setPwForm: (f: { current: string; new: string; confirm: string }) => void;
  pwError: string;
  onChangePassword: () => void;
  onExport: () => void;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Display Limits */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: ADMIN_CARD,
          border: `1px solid ${ADMIN_BORDER}`,
        }}
      >
        <h4
          className="text-[0.75rem] tracking-wider uppercase mb-4 flex items-center gap-2"
          style={{ color: ADMIN_ACCENT }}
        >
          <Settings size={14} />
          Display Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="text-[0.6rem] tracking-wider uppercase mb-1 block"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              Homepage Outfit Limit
            </label>
            <input
              type="number"
              min={2}
              max={20}
              value={settings.ofLim}
              onChange={(e) =>
                setSettings({ ...settings, ofLim: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ADMIN_BORDER}`,
                color: ADMIN_TEXT,
              }}
            />
          </div>
          <div>
            <label
              className="text-[0.6rem] tracking-wider uppercase mb-1 block"
              style={{ color: "rgba(232,224,216,0.5)" }}
            >
              Homepage Accessories Limit
            </label>
            <input
              type="number"
              min={2}
              max={20}
              value={settings.acLim}
              onChange={(e) =>
                setSettings({ ...settings, acLim: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${ADMIN_BORDER}`,
                color: ADMIN_TEXT,
              }}
            />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="text-[0.6rem] tracking-wider uppercase mb-1 block"
            style={{ color: "rgba(232,224,216,0.5)" }}
          >
            Affiliate Disclaimer Text
          </label>
          <textarea
            value={settings.disc}
            onChange={(e) =>
              setSettings({ ...settings, disc: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${ADMIN_BORDER}`,
              color: ADMIN_TEXT,
            }}
          />
        </div>
        <button
          onClick={onSave}
          className="mt-4 px-5 py-2.5 rounded-lg text-[0.7rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
          style={{ background: ADMIN_ACCENT }}
        >
          Save Settings
        </button>
      </div>

      {/* Change Password */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: ADMIN_CARD,
          border: `1px solid ${ADMIN_BORDER}`,
        }}
      >
        <h4
          className="text-[0.75rem] tracking-wider uppercase mb-4 flex items-center gap-2"
          style={{ color: ADMIN_ACCENT }}
        >
          Change Admin Password
        </h4>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={pwForm.current}
            onChange={(e) =>
              setPwForm({ ...pwForm, current: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${ADMIN_BORDER}`,
              color: ADMIN_TEXT,
            }}
          />
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={pwForm.new}
            onChange={(e) =>
              setPwForm({ ...pwForm, new: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${ADMIN_BORDER}`,
              color: ADMIN_TEXT,
            }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={pwForm.confirm}
            onChange={(e) =>
              setPwForm({ ...pwForm, confirm: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${ADMIN_BORDER}`,
              color: ADMIN_TEXT,
            }}
          />
          {pwError && (
            <p className="text-[0.75rem]" style={{ color: "#e53e3e" }}>
              {pwError}
            </p>
          )}
          <button
            onClick={onChangePassword}
            className="px-5 py-2.5 rounded-lg text-[0.7rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
            style={{ background: ADMIN_ACCENT }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: ADMIN_CARD,
          border: "1px solid rgba(229,62,62,0.2)",
        }}
      >
        <h4
          className="text-[0.75rem] tracking-wider uppercase mb-4"
          style={{ color: "#e53e3e" }}
        >
          Danger Zone
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[0.7rem] tracking-wider uppercase transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: ADMIN_TEXT,
              border: `1px solid ${ADMIN_BORDER}`,
            }}
          >
            <Download size={14} />
            Export Backup
          </button>
        </div>
      </div>
    </div>
  );
}

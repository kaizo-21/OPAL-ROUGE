import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  OutfitItem,
  AccessoryItem,
  ShopLookItem,
  TrendGuideItem,
  ContentType,
} from "./types";

const COLLECTIONS: Record<ContentType, string> = {
  outfits: "outfits",
  accessories: "accessories",
  shop: "shop",
  trends: "trends",
};

// Helper to generate date string
function getDateStr(): string {
  return new Date().toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

// =====================
// READ ALL ITEMS
// =====================
export async function getAllItems<T>(type: ContentType): Promise<T[]> {
  const colRef = collection(db, COLLECTIONS[type]);
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

// =====================
// REALTIME LISTENER
// =====================
export function subscribeToItems<T>(
  type: ContentType,
  callback: (items: T[]) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTIONS[type]);
  const q = query(colRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    callback(items);
  });
}

// =====================
// ADD ITEM
// =====================
export async function addItem(
  type: ContentType,
  data: Record<string, string>
): Promise<string> {
  const colRef = collection(db, COLLECTIONS[type]);
  const docRef = await addDoc(colRef, {
    ...data,
    date: getDateStr(),
    createdAt: Date.now(),
  });
  return docRef.id;
}

// =====================
// UPDATE ITEM
// =====================
export async function updateItem(
  type: ContentType,
  id: string,
  data: Record<string, string>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS[type], id);
  await updateDoc(docRef, { ...data });
}

// =====================
// DELETE ITEM
// =====================
export async function deleteItem(
  type: ContentType,
  id: string
): Promise<void> {
  const docRef = doc(db, COLLECTIONS[type], id);
  await deleteDoc(docRef);
}

// =====================
// BULK DELETE
// =====================
export async function bulkDeleteItems(
  type: ContentType,
  ids: string[]
): Promise<void> {
  const promises = ids.map((id) => deleteItem(type, id));
  await Promise.all(promises);
}

// =====================
// REORDER ITEMS
// =====================
export async function reorderItems(
  type: ContentType,
  items: { id: string; order: number }[]
): Promise<void> {
  const promises = items.map((item) =>
    updateItem(type, item.id, { order: String(item.order) })
  );
  await Promise.all(promises);
}

// =====================
// SETTINGS
// =====================
const SETTINGS_DOC = "site_settings";

export async function getSettings(): Promise<Record<string, string>> {
  const { getDoc } = await import("firebase/firestore");
  const docRef = doc(db, "settings", SETTINGS_DOC);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Record<string, string>) : {};
}

export async function saveSettings(
  settings: Record<string, string>
): Promise<void> {
  const { setDoc } = await import("firebase/firestore");
  const docRef = doc(db, "settings", SETTINGS_DOC);
  await setDoc(docRef, settings, { merge: true });
}

// =====================
// ADMIN AUTH
// =====================
const ADMIN_PW_DOC = "admin_auth";

export async function getAdminPassword(): Promise<string> {
  const { getDoc } = await import("firebase/firestore");
  const docRef = doc(db, "settings", ADMIN_PW_DOC);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data().password as string) : "opal2025";
}

export async function setAdminPassword(password: string): Promise<void> {
  const { setDoc } = await import("firebase/firestore");
  const docRef = doc(db, "settings", ADMIN_PW_DOC);
  await setDoc(docRef, { password });
}

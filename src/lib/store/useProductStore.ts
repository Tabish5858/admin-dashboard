/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  saleEndsAt?: Date;
  description?: string;
  imageUrl: string;
  createdAt: Date;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const q = query(collection(db, "products"), orderBy("name"));
      const querySnapshot = await getDocs(q);

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        saleEndsAt: doc.data().saleEndsAt?.toDate(),
      })) as Product[];

      set({ products, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch products",
        loading: false,
      });
    }
  },

  addProduct: async (product) => {
    try {
      set({ loading: true });

      const productData = Object.fromEntries(
        Object.entries(product).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, "products"), productData);
      const newProduct = { ...product, id: docRef.id };

      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
        error: null,
      }));

      return newProduct;
    } catch (error) {
      console.error("Failed to add product:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to add product",
        loading: false,
      });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ loading: true });
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, updates);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update product",
        loading: false,
      });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "products", id));
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete product",
        loading: false,
      });
    }
  },
}));

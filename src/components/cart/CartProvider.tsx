"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CartLineInput, Quote } from "@/lib/pricing";
import { quoteCart } from "@/lib/orders-store";

const KEY = "zf_cart_v1";
const COUPON_KEY = "zf_coupon_v1";

type Toast = { id: number; text: string } | null;

type CartCtx = {
  lines: CartLineInput[];
  count: number;
  quote: Quote | null;
  loading: boolean;
  ready: boolean;
  couponCode: string;
  add: (variantId: number, qty: number, label?: string) => void;
  setQty: (variantId: number, qty: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => void;
  refresh: () => Promise<void>;
  toast: Toast;
  dismissToast: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

function readLines(): CartLineInput[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw)
      ? raw.filter((l) => Number.isInteger(l?.variantId) && Number.isInteger(l?.qty) && l.qty > 0).slice(0, 50)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLineInput[]>([]);
  const [ready, setReady] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    setLines(readLines());
    try {
      setCouponCode(localStorage.getItem(COUPON_KEY) || "");
    } catch {}
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLines(readLines());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const refresh = useCallback(async () => {
    if (!lines.length) {
      setQuote(null);
      return;
    }
    setLoading(true);
    try {
      const computed = quoteCart(lines, couponCode || null);
      setQuote(computed);
    } finally {
      setLoading(false);
    }
  }, [lines, couponCode]);

  useEffect(() => {
    if (ready) void refresh();
  }, [ready, refresh]);

  const add = useCallback((variantId: number, qty: number, label?: string) => {
    setLines((prev) => {
      const ex = prev.find((l) => l.variantId === variantId);
      return ex
        ? prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(l.qty + qty, 99) } : l))
        : [...prev, { variantId, qty }];
    });
    setToast({ id: Date.now(), text: label ? `${label} added to your cart` : "Added to your cart" });
  }, []);

  const setQty = useCallback((variantId: number, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const remove = useCallback(
    (variantId: number) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)),
    [],
  );

  const clear = useCallback(() => {
    setLines([]);
    setCouponCode("");
    try {
      localStorage.removeItem(COUPON_KEY);
    } catch {}
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const c = code.trim().toUpperCase().slice(0, 40);
    setCouponCode(c);
    try {
      if (c) localStorage.setItem(COUPON_KEY, c);
      else localStorage.removeItem(COUPON_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      quote,
      loading,
      ready,
      couponCode,
      add,
      setQty,
      remove,
      clear,
      applyCoupon,
      refresh,
      toast,
      dismissToast: () => setToast(null),
    }),
    [lines, quote, loading, ready, couponCode, add, setQty, remove, clear, applyCoupon, refresh, toast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

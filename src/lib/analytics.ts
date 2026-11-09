"use client";

/**
 * Analytics event layer (GA4-compatible event names).
 * Events are pushed to window.dataLayer ONLY after the visitor grants analytics consent.
 * Wire GA4 / GTM / Meta Pixel by setting NEXT_PUBLIC_GA_ID (see ConsentBanner).
 */

export type AnalyticsEvent =
  | "view_item"
  | "view_item_list"
  | "select_item"
  | "select_variant"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "add_payment_info"
  | "purchase"
  | "generate_lead"
  | "check_pincode";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "zf_consent_v1";

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") window.gtag("event", event, params);
  else window.dataLayer.push({ event, ...params });
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, params);
}

export function itemParams(i: { sku?: string; variantId?: number; name: string; variant: string; pricePaise: number; qty?: number }) {
  return {
    currency: "INR",
    value: (i.pricePaise * (i.qty ?? 1)) / 100,
    items: [{ item_id: i.sku ?? String(i.variantId), item_name: i.name, item_variant: i.variant, price: i.pricePaise / 100, quantity: i.qty ?? 1 }],
  };
}

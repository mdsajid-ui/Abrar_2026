/**
 * Pure pricing engine. No I/O — the server feeds it database rows so that
 * every total shown or charged is computed from trusted data. Client-supplied
 * prices are never used.
 *
 * All money values are integer paise.
 */

export type PricingVariant = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  label: string;
  units: number; // bottles per pack
  pricePaise: number;
  mrpPaise: number;
  active: boolean;
  productActive: boolean;
  productStockBottles: number;
  image: string;
};

export type PricingSettings = {
  deliveryFeePaise: number;
  freeDeliveryThresholdPaise: number; // 0 = never free
  minOrderPaise: number;
  gstRatePercent: number; // prices are GST-inclusive; used to show the tax component
  maxQtyPerLine: number;
};

export type PricingCoupon = {
  code: string;
  type: "percent" | "flat";
  value: number; // percent (1-100) or paise
  minSubtotalPaise: number;
  active: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
};

export type CartLineInput = { variantId: number; qty: number };

export type QuoteLine = {
  variantId: number;
  productName: string;
  productSlug: string;
  label: string;
  units: number;
  unitPricePaise: number;
  mrpPaise: number;
  qty: number;
  lineTotalPaise: number;
  image: string;
  available: boolean;
  issue?: string;
};

export type Quote = {
  lines: QuoteLine[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  discountPaise: number;
  taxIncludedPaise: number;
  totalPaise: number;
  totalBottles: number;
  couponCode: string | null;
  couponMessage: string | null;
  freeDeliveryRemainingPaise: number;
  errors: string[];
  canCheckout: boolean;
};

export function validateCoupon(
  coupon: PricingCoupon | null | undefined,
  subtotalPaise: number,
  now: Date = new Date(),
): { ok: true; discountPaise: number } | { ok: false; message: string } {
  if (!coupon || !coupon.active) return { ok: false, message: "This code is not valid." };
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now.getTime())
    return { ok: false, message: "This code has expired." };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
    return { ok: false, message: "This code has reached its usage limit." };
  if (subtotalPaise < coupon.minSubtotalPaise)
    return {
      ok: false,
      message: `Add ${formatINR(coupon.minSubtotalPaise - subtotalPaise)} more to use this code.`,
    };
  let d = coupon.type === "percent" ? Math.floor((subtotalPaise * coupon.value) / 100) : coupon.value;
  d = Math.max(0, Math.min(d, subtotalPaise));
  return { ok: true, discountPaise: d };
}

export function computeQuote(
  input: CartLineInput[],
  variants: Map<number, PricingVariant>,
  settings: PricingSettings,
  coupon?: PricingCoupon | null,
  couponCodeRequested?: string | null,
  now: Date = new Date(),
): Quote {
  const errors: string[] = [];
  const merged = new Map<number, number>();
  for (const l of input) {
    if (!Number.isInteger(l.variantId) || !Number.isInteger(l.qty) || l.qty <= 0) continue;
    merged.set(l.variantId, (merged.get(l.variantId) ?? 0) + l.qty);
  }

  // Bottles requested per product (stock is tracked per product, in bottles)
  const bottlesByProduct = new Map<number, number>();
  for (const [vid, qty] of merged) {
    const v = variants.get(vid);
    if (v) bottlesByProduct.set(v.productId, (bottlesByProduct.get(v.productId) ?? 0) + v.units * qty);
  }

  const lines: QuoteLine[] = [];
  let subtotal = 0;
  let totalBottles = 0;
  for (const [vid, rawQty] of merged) {
    const v = variants.get(vid);
    if (!v) {
      errors.push("An item in your cart is no longer available and was skipped.");
      continue;
    }
    const qty = Math.min(rawQty, settings.maxQtyPerLine);
    let available = true;
    let issue: string | undefined;
    if (!v.active || !v.productActive) {
      available = false;
      issue = "This pack is currently unavailable.";
    } else if ((bottlesByProduct.get(v.productId) ?? 0) > v.productStockBottles) {
      available = false;
      const maxPacks = Math.floor(v.productStockBottles / v.units);
      issue =
        maxPacks <= 0
          ? "Out of stock."
          : `Only ${v.productStockBottles} bottles left in stock — please reduce the quantity.`;
    }
    if (rawQty > settings.maxQtyPerLine) {
      issue = `Maximum ${settings.maxQtyPerLine} per order online. For larger orders use Bulk Orders.`;
    }
    const lineTotal = v.pricePaise * qty;
    lines.push({
      variantId: v.id,
      productName: v.productName,
      productSlug: v.productSlug,
      label: v.label,
      units: v.units,
      unitPricePaise: v.pricePaise,
      mrpPaise: v.mrpPaise,
      qty,
      lineTotalPaise: lineTotal,
      image: v.image,
      available,
      issue,
    });
    if (available) {
      subtotal += lineTotal;
      totalBottles += v.units * qty;
    } else {
      errors.push(`${v.productName} (${v.label}): ${issue}`);
    }
  }

  let discount = 0;
  let couponMessage: string | null = null;
  let appliedCode: string | null = null;
  if (couponCodeRequested) {
    const r = validateCoupon(coupon, subtotal, now);
    if (r.ok) {
      discount = r.discountPaise;
      appliedCode = coupon!.code;
      couponMessage = `Code ${coupon!.code} applied.`;
    } else {
      couponMessage = r.message;
    }
  }

  const afterDiscount = subtotal - discount;
  const freeDelivery = settings.freeDeliveryThresholdPaise > 0 && afterDiscount >= settings.freeDeliveryThresholdPaise;
  const delivery = subtotal === 0 || freeDelivery ? 0 : settings.deliveryFeePaise;
  const total = afterDiscount + delivery;
  const taxIncluded = Math.round((total * settings.gstRatePercent) / (100 + settings.gstRatePercent));
  const freeDeliveryRemaining =
    settings.freeDeliveryThresholdPaise > 0 && !freeDelivery
      ? settings.freeDeliveryThresholdPaise - afterDiscount
      : 0;

  if (subtotal > 0 && subtotal < settings.minOrderPaise) {
    errors.push(`Minimum order value is ${formatINR(settings.minOrderPaise)}.`);
  }

  const canCheckout =
    lines.length > 0 && lines.every((l) => l.available) && subtotal > 0 && subtotal >= settings.minOrderPaise;

  return {
    lines,
    subtotalPaise: subtotal,
    deliveryFeePaise: delivery,
    discountPaise: discount,
    taxIncludedPaise: taxIncluded,
    totalPaise: total,
    totalBottles,
    couponCode: appliedCode,
    couponMessage,
    freeDeliveryRemainingPaise: Math.max(0, freeDeliveryRemaining),
    errors,
    canCheckout,
  };
}

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

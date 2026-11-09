export type Spec = { k: string; v: string };
export type GalleryImage = { src: string; alt: string; kind: "illustration" | "photo" | "lifestyle" };

export type Variant = {
  id: number;
  productId: number;
  sku: string;
  label: string;
  units: number;
  pricePaise: number;
  mrpPaise: number;
  useCase: string;
  active: boolean;
  sort: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  sizeMl: number;
  image: string;
  gallery: GalleryImage[];
  specs: Spec[];
  stockBottles: number;
  active: boolean;
  variants: Variant[];
};

export type PricingVariant = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  label: string;
  units: number;
  pricePaise: number;
  mrpPaise: number;
  active: boolean;
  productActive: boolean;
  productStockBottles: number;
  image: string;
};

export type PricingSettings = {
  deliveryFeePaise: number;
  freeDeliveryThresholdPaise: number;
  minOrderPaise: number;
  gstRatePercent: number;
  maxQtyPerLine: number;
};

export type PricingCoupon = {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSubtotalPaise: number;
  active: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
};

export type ServicePincode = { pincode: string; area: string; eta: string };

const SPECS: Spec[] = [
  { k: "Volume", v: "500 ml per bottle" },
  { k: "Type", v: "Packaged drinking water" },
  { k: "Added minerals (typical values)", v: "Sodium Bicarbonate 0.5 mg · Magnesium Sulphate 0.2 mg · Potassium Bicarbonate 0.1 mg" },
  { k: "Packaging", v: "PET bottle, recyclable" },
  { k: "Storage", v: "Cool, dry & hygienic place, away from direct sunlight" },
  { k: "MRP per bottle", v: "₹10 (inclusive of all taxes)" },
  { k: "Manufactured by", v: "M/S S.R. Groups, Kendrapara, Odisha" },
  { k: "Sold by", v: "Constant Abrar Co., Kendrapara, Odisha" },
];

import { assetPath } from "@/lib/assets";

const GALLERY: GalleryImage[] = [
  { src: assetPath("/images/bottle-500ml.svg"), alt: "Illustration of the Zippyfeed 500 ml bottle", kind: "illustration" },
  { src: assetPath("/images/zippyfeed-500ml-label-photo.png"), alt: "Photo of the actual Zippyfeed 500 ml bottle showing the full label", kind: "photo" },
  { src: assetPath("/images/use-home.jpg"), alt: "A case of water bottles on a kitchen counter", kind: "lifestyle" },
  { src: assetPath("/images/use-events.jpg"), alt: "Water bottles set out at an event", kind: "lifestyle" },
];

const VARIANTS: Variant[] = [
  { id: 1, productId: 1, sku: "ZF-500-12", label: "Case of 12", units: 12, pricePaise: 12000, mrpPaise: 12000, useCase: "Homes & small offices", active: true, sort: 1 },
  { id: 2, productId: 1, sku: "ZF-500-24", label: "Case of 24", units: 24, pricePaise: 24000, mrpPaise: 24000, useCase: "Families, shops & cafés", active: true, sort: 2 },
  { id: 3, productId: 1, sku: "ZF-500-48", label: "2 Cases (48 bottles)", units: 48, pricePaise: 48000, mrpPaise: 48000, useCase: "Offices, meetings & small events", active: true, sort: 3 },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "zippyfeed-packaged-drinking-water-500ml",
    name: "Zippyfeed Packaged Drinking Water — 500 ml",
    shortName: "Packaged Drinking Water 500 ml",
    tagline: "Pure & safe everyday hydration, bottled in Kendrapara.",
    description:
      "Zippyfeed Kendrapara Packaged Drinking Water comes in a handy 500 ml bottle that fits a bag, a desk or a car's cup holder. It has a light, refreshing taste, with minerals added as listed on the label. Order it by the case for your home, office, shop or event, and we'll deliver it to your door within our local service area.",
    sizeMl: 500,
    image: assetPath("/images/bottle-500ml.svg"),
    gallery: GALLERY,
    specs: SPECS,
    stockBottles: 2400,
    active: true,
    variants: VARIANTS,
  },
];

export const SERVICE_PINCODES: ServicePincode[] = [
  { pincode: "754211", area: "Kendrapara", eta: "Same or next day" },
  { pincode: "754250", area: "Thakurpatna / Haladia", eta: "Next day" },
];

export const SETTINGS_MAP: Record<string, string> = {
  delivery_fee_paise: "4000",
  free_delivery_threshold_paise: "48000",
  min_order_paise: "12000",
  gst_rate_percent: "18",
  max_qty_per_line: "20",
  cod_enabled: "1",
  pending_payment_expiry_minutes: "30",
};

export const COUPONS: PricingCoupon[] = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minSubtotalPaise: 12000,
    active: true,
    expiresAt: null,
    usageLimit: 1000,
    usedCount: 0,
  },
  {
    code: "ZIPPY50",
    type: "flat",
    value: 5000,
    minSubtotalPaise: 24000,
    active: true,
    expiresAt: null,
    usageLimit: 500,
    usedCount: 0,
  },
];

export function listProducts(opts: { includeInactive?: boolean } = {}): Product[] {
  return PRODUCTS.filter((p) => opts.includeInactive || p.active);
}

export function getProductBySlug(slug: string): Product | null {
  return PRODUCTS.find((p) => p.slug === slug && p.active) ?? null;
}

export function getPricingVariants(ids?: number[]): Map<number, PricingVariant> {
  const m = new Map<number, PricingVariant>();
  for (const p of PRODUCTS) {
    for (const v of p.variants) {
      if (ids && !ids.includes(v.id)) continue;
      m.set(v.id, {
        id: v.id,
        productId: p.id,
        productName: p.name,
        productSlug: p.slug,
        label: v.label,
        units: v.units,
        pricePaise: v.pricePaise,
        mrpPaise: v.mrpPaise,
        active: v.active,
        productActive: p.active,
        productStockBottles: p.stockBottles,
        image: p.image,
      });
    }
  }
  return m;
}

export function getSettingsMap(): Record<string, string> {
  return { ...SETTINGS_MAP };
}

export function getPricingSettings(): PricingSettings {
  return {
    deliveryFeePaise: Number(SETTINGS_MAP.delivery_fee_paise ?? 0),
    freeDeliveryThresholdPaise: Number(SETTINGS_MAP.free_delivery_threshold_paise ?? 0),
    minOrderPaise: Number(SETTINGS_MAP.min_order_paise ?? 0),
    gstRatePercent: Number(SETTINGS_MAP.gst_rate_percent ?? 0),
    maxQtyPerLine: Number(SETTINGS_MAP.max_qty_per_line ?? 20),
  };
}

export function isCodEnabled(): boolean {
  return SETTINGS_MAP.cod_enabled === "1";
}

export function getCoupon(code: string | null | undefined): PricingCoupon | null {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === clean && c.active) ?? null;
}

export function listPincodes(): ServicePincode[] {
  return [...SERVICE_PINCODES];
}

export function getPincode(pin: string): ServicePincode | null {
  const clean = pin.trim();
  return SERVICE_PINCODES.find((p) => p.pincode === clean) ?? null;
}

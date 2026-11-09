/**
 * Central business facts.
 *
 * RULE: Only values read from the actual product label or supplied by the business
 * are marked `verified`. Everything else is `null` (renders as a visible
 * "pending" badge) or explicitly labelled as a placeholder. Replace before launch.
 */

export type Fact<T = string> = { value: T | null; verified: boolean; note?: string };

export const business = {
  /** Shows a thin site-wide banner stating that prices/policies are placeholders. Set false at launch. */
  previewMode: false,

  brand: {
    name: "Zippyfeed",
    productLine: "Kendrapara Packaged Drinking Water",
    // Read from label. Confirm you are authorised to use the brand/mascot.
  },

  label: {
    sizeMl: 500,
    mrpPaise: 1000, // ₹10 incl. of all taxes (label)
    claims: ["Pure & Safe", "Natural Minerals", "Healthy Hydration", "Refreshing Taste"],
    minerals: [
      { name: "Sodium Bicarbonate", amount: "0.5 mg" },
      { name: "Magnesium Sulphate", amount: "0.2 mg" },
      { name: "Potassium Bicarbonate", amount: "0.1 mg" },
    ],
    mineralsBasis: "Typical values as printed on the label (per-volume basis to be confirmed)",
    storage: "Store in a cool, dry & hygienic place, away from direct sunlight.",
    packaging: "PET bottle (recyclable)",
    shelfLife: { value: "Best before 6 months from the date of manufacture", verified: false, note: "Partly legible on label — confirm" } as Fact,
  },

  legal: {
    manufacturer: { value: "M/S S.R. Groups, Kendrapara, Odisha", verified: true, note: "Full address/PIN to confirm" } as Fact,
    seller: { value: "Constant Abrar Co., Thakurpatna, Kendrapara, Odisha", verified: true, note: "Full address/PIN to confirm" } as Fact,
    fssaiLicence: { value: null, verified: false, note: "Mandatory for online food sales in India" } as Fact,
    bisLicence: { value: null, verified: false, note: "BIS (ISI) CM/L number required for packaged drinking water" } as Fact,
    gstin: { value: null, verified: false } as Fact,
  },

  contact: {
    phone: { value: "8637213741", verified: true, note: "Official contact" } as Fact,
    whatsapp: { value: "8637213741", verified: true } as Fact,
    email: { value: "abrar@storzen.io", verified: true } as Fact,
    hours: { value: "Mon–Sat, 8:00 AM – 8:00 PM", verified: true } as Fact,
  },
} as const;

export function factText(f: Fact, fallback = "To be added"): string {
  return f.value ?? fallback;
}

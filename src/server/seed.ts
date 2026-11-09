import type { DatabaseSync } from "node:sqlite";

/**
 * Initial catalogue + settings. Inserted once (only when the products table is empty).
 *
 * VERIFIED (from label): 500 ml size, ₹10 MRP per bottle, label claims, minerals,
 * storage, manufacturer/seller.
 * PLACEHOLDERS (confirm with business): pack sizes, pack prices, stock levels,
 * delivery fee, free-delivery threshold, service PIN codes, ETAs.
 * Pack prices are set at MRP × units — no invented discounts.
 */
export function seedDatabase(db: DatabaseSync) {
  const row = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (row.n > 0) return;

  const specs = [
    { k: "Volume", v: "500 ml per bottle" },
    { k: "Type", v: "Packaged drinking water" },
    { k: "Added minerals (typical values)", v: "Sodium Bicarbonate 0.5 mg · Magnesium Sulphate 0.2 mg · Potassium Bicarbonate 0.1 mg" },
    { k: "Packaging", v: "PET bottle, recyclable" },
    { k: "Storage", v: "Cool, dry & hygienic place, away from direct sunlight" },
    { k: "MRP per bottle", v: "₹10 (inclusive of all taxes)" },
    { k: "Manufactured by", v: "M/S S.R. Groups, Kendrapara, Odisha" },
    { k: "Sold by", v: "Constant Abrar Co., Kendrapara, Odisha" },
  ];
  const gallery = [
    { src: "/images/bottle-500ml.svg", alt: "Illustration of the Zippyfeed 500 ml bottle", kind: "illustration" },
    { src: "/images/zippyfeed-500ml-label-photo.png", alt: "Photo of the actual Zippyfeed 500 ml bottle showing the full label", kind: "photo" },
    { src: "/images/use-home.jpg", alt: "A case of water bottles on a kitchen counter (representative image)", kind: "lifestyle" },
    { src: "/images/use-events.jpg", alt: "Water bottles set out at an event (representative image)", kind: "lifestyle" },
  ];

  db.exec("BEGIN");
  try {
    const p = db
      .prepare(
        `INSERT INTO products (slug,name,short_name,tagline,description,size_ml,image,gallery,specs,stock_bottles,active,sort)
         VALUES (?,?,?,?,?,?,?,?,?,?,1,0)`,
      )
      .run(
        "zippyfeed-packaged-drinking-water-500ml",
        "Zippyfeed Packaged Drinking Water — 500 ml",
        "Packaged Drinking Water 500 ml",
        "Pure & safe everyday hydration, bottled in Kendrapara.",
        "Zippyfeed Kendrapara Packaged Drinking Water comes in a handy 500 ml bottle that fits a bag, a desk or a car's cup holder. It has a light, refreshing taste, with minerals added as listed on the label. Order it by the case for your home, office, shop or event, and we'll deliver it to your door within our local service area.",
        500,
        "/images/bottle-500ml.svg",
        JSON.stringify(gallery),
        JSON.stringify(specs),
        2400, // PLACEHOLDER stock (bottles)
      );
    const pid = Number(p.lastInsertRowid);
    const v = db.prepare(
      `INSERT INTO variants (product_id,sku,label,units,price_paise,mrp_paise,use_case,active,sort) VALUES (?,?,?,?,?,?,?,1,?)`,
    );
    v.run(pid, "ZF-500-12", "Case of 12", 12, 12000, 12000, "Homes & small offices", 1);
    v.run(pid, "ZF-500-24", "Case of 24", 24, 24000, 24000, "Families, shops & cafés", 2);
    v.run(pid, "ZF-500-48", "2 Cases (48 bottles)", 48, 48000, 48000, "Offices, meetings & small events", 3);

    const s = db.prepare("INSERT INTO settings (key,value) VALUES (?,?)");
    s.run("delivery_fee_paise", "4000"); // PLACEHOLDER ₹40
    s.run("free_delivery_threshold_paise", "48000"); // PLACEHOLDER ₹480
    s.run("min_order_paise", "12000"); // PLACEHOLDER ₹120 (one case)
    s.run("gst_rate_percent", "18"); // PLACEHOLDER — confirm with your CA (HSN 2201)
    s.run("max_qty_per_line", "20");
    s.run("cod_enabled", "1");
    s.run("pending_payment_expiry_minutes", "30");

    const pin = db.prepare("INSERT INTO service_pincodes (pincode,area,eta) VALUES (?,?,?)");
    // PLACEHOLDER service area — confirm real delivery PIN codes.
    pin.run("754211", "Kendrapara", "Same or next day");
    pin.run("754250", "Thakurpatna / Haladia", "Next day");
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

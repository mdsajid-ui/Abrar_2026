import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { seedDatabase } from "./seed";

/**
 * Data-access bootstrap. Uses Node's built-in SQLite (no native add-ons to install).
 * For production at scale, swap this module for PostgreSQL — all SQL lives in /src/server/*.
 */

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "store.db");

const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  size_ml INTEGER NOT NULL,
  image TEXT NOT NULL,
  gallery TEXT NOT NULL DEFAULT '[]',
  specs TEXT NOT NULL DEFAULT '[]',
  stock_bottles INTEGER NOT NULL DEFAULT 0 CHECK (stock_bottles >= 0),
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  units INTEGER NOT NULL CHECK (units > 0),
  price_paise INTEGER NOT NULL CHECK (price_paise >= 0),
  mrp_paise INTEGER NOT NULL CHECK (mrp_paise >= 0),
  use_case TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service_pincodes (
  pincode TEXT PRIMARY KEY,
  area TEXT NOT NULL,
  eta TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('percent','flat')),
  value INTEGER NOT NULL,
  min_subtotal_paise INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'none',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  notes TEXT,
  subtotal_paise INTEGER NOT NULL,
  delivery_fee_paise INTEGER NOT NULL,
  discount_paise INTEGER NOT NULL,
  tax_included_paise INTEGER NOT NULL,
  total_paise INTEGER NOT NULL,
  coupon_code TEXT,
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  stock_released INTEGER NOT NULL DEFAULT 0,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  variant_label TEXT NOT NULL,
  sku TEXT NOT NULL,
  units INTEGER NOT NULL,
  unit_price_paise INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  line_total_paise INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS order_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL CHECK (channel IN ('email','whatsapp')),
  contact TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  unsubscribed_at TEXT,
  UNIQUE(channel, contact)
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL CHECK (kind IN ('bulk','contact')),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  organisation TEXT,
  quantity TEXT,
  event_date TEXT,
  pincode TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  event TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

declare global {
  // eslint-disable-next-line no-var
  var __zfDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  seedDatabase(db);
  return db;
}

export function db(): DatabaseSync {
  if (!globalThis.__zfDb) globalThis.__zfDb = open();
  return globalThis.__zfDb;
}

/** Run fn inside a write transaction (BEGIN IMMEDIATE serialises concurrent writers). */
export function tx<T>(fn: (d: DatabaseSync) => T): T {
  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    const r = fn(d);
    d.exec("COMMIT");
    return r;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}

export const nowIso = () => new Date().toISOString();

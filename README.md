# Zippyfeed Packaged Drinking Water — E-Commerce Store

High-converting, sales-focused e-commerce storefront for **Zippyfeed Kendrapara Packaged Drinking Water (500ml, MRP ₹10)**.

Built with **Next.js 16 (App Router)**, **TypeScript**, **SQLite (via Node.js built-in `node:sqlite`)**, and custom high-contrast, responsive CSS design tokens.

---

## 🚀 Key Features

1. **Brand & Product Truth**:
   - Built around the verified product bottle: Kendrapara Packaged Drinking Water, 500ml, ₹10 MRP.
   - Genuine mineral declarations (Sodium Bicarbonate, Magnesium Sulphate, Potassium Bicarbonate).
   - Clear visual indicators for pending regulatory details (FSSAI/BIS placeholders).

2. **Sales Funnel & Local Logistics Model**:
   - Case-pack ordering (Case of 12 for ₹120, Case of 24 for ₹240, 2 Cases of 48 for ₹480).
   - Doorstep delivery service pin-code validator (`/api/pincode`).
   - Free delivery threshold triggers.
   - Dedicated B2B & Event inquiry funnel (`/bulk-orders`) for weddings, conferences, and retail drops.

3. **Robust E-Commerce Infrastructure**:
   - Server-validated pricing engine in integer paise (prevents client-side price tampering).
   - Atomic SQLite transactions with stock reservation and overselling prevention.
   - Dual payment options: **Cash on Delivery (COD)** and **Razorpay Online Payments** (with dev simulator fallback).
   - Order tracking portal (`/track`) and order confirmation receipts (`/order/[publicId]`).
   - Admin management panel (`/admin`).

4. **Marketing & Conversion Optimization**:
   - Consent-first WhatsApp and Email restock subscription module (`/api/leads`).
   - Cookie consent and GA4-compatible event tracking layer (`track("add_to_cart")`, `track("begin_checkout")`).
   - Fully accessible, mobile-first responsive layout with fast static prerendering (SSG) and JSON-LD product structured data.

---

## 🛠️ Getting Started

### 1. Installation & Setup
```bash
# Clone the repository and enter directory
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```
- For production online payments, set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- For admin authentication, set `ADMIN_PASSWORD` and `SESSION_SECRET`.

### 3. Running in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Production Build & Tests
```bash
npm run typecheck
npm run build
npm test
```

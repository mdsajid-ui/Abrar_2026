import type { Metadata } from "next";
import { listProducts } from "@/server/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop Packaged Drinking Water Cases",
  description: "Explore Zippyfeed packaged drinking water packs. Available in 12, 24, and 48 bottle cases with local Kendrapara delivery.",
};

export default function ShopPage() {
  const products = listProducts();

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Shop</li>
          </ol>
        </div>

        <div className="section-head">
          <span className="eyebrow">Direct Case Supply</span>
          <h1>All Bottle Packs</h1>
          <p className="lead muted">
            Wholesome, refreshing mineral-infused water packed in convenient 500ml bottles. Select your preferred quantity below.
          </p>
        </div>

        <div className="grid grid-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 card" style={{ background: "var(--c-mist)" }}>
          <div className="row between">
            <div>
              <h3>Ordering for a recurring weekly office or café delivery?</h3>
              <p className="small muted mb-0">Set up custom drop schedules or ask for discounted standing order pricing.</p>
            </div>
            <Link href="/bulk-orders" className="btn btn-primary">
              Enquire Bulk / Recurring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

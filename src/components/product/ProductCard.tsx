"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { track, itemParams } from "@/lib/analytics";
import type { Product, Variant } from "@/server/catalog";
import { InteractiveWaterBottle } from "./InteractiveWaterBottle";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<number>(
    product.variants[0]?.id ?? 0
  );

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;
    add(selectedVariant.id, 1, `${product.shortName} (${selectedVariant.label})`);
    track("add_to_cart", itemParams({
      sku: selectedVariant.sku,
      name: product.name,
      variant: selectedVariant.label,
      pricePaise: selectedVariant.pricePaise,
      qty: 1
    }));
  };

  return (
    <article className="product-card">
      <div className="media">
        <span className="badge badge-aqua pack-tag">500 ml Bottles</span>
        <div className="pack-visual" style={{ padding: "10px 0" }}>
          <InteractiveWaterBottle size={240} />
        </div>
      </div>
      <div className="body">
        <div className="meta-list">
          <span className="badge badge-green">Pure & Safe</span>
          <span className="badge">Natural Minerals</span>
        </div>
        <h3>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="small muted mb-2">{product.tagline}</p>

        {product.variants.length > 1 && (
          <div className="field mb-2" style={{ zIndex: 3, position: "relative" }}>
            <label className="hint" htmlFor={`variant-select-${product.id}`}>
              Select Pack Size:
            </label>
            <select
              id={`variant-select-${product.id}`}
              className="select"
              style={{ minHeight: "38px", fontSize: "0.875rem" }}
              value={selectedVariantId}
              onChange={(e) => {
                const vid = Number(e.target.value);
                setSelectedVariantId(vid);
                const v = product.variants.find(x => x.id === vid);
                if (v) {
                  track("select_variant", { variant: v.label, sku: v.sku });
                }
              }}
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.units} bottles) — {formatINR(v.pricePaise)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="row between mt-auto" style={{ alignItems: "baseline" }}>
          <div>
            <span className="price">{formatINR(selectedVariant?.pricePaise ?? 0)}</span>
            <span className="price-sub"> / pack (₹10/bottle)</span>
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="btn btn-outline btn-sm"
            aria-label={`View details for ${product.name}`}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

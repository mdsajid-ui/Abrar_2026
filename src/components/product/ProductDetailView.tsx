"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/pricing";
import { useCart } from "@/components/cart/CartProvider";
import { track, itemParams } from "@/lib/analytics";
import type { Product, GalleryImage } from "@/server/catalog";
import { IconCheck, IconTruck, IconShield, IconRefresh } from "@/components/ui/Icons";

export function ProductDetailView({ product }: { product: Product }) {
  const { add } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<number>(
    product.variants[0]?.id ?? 0
  );
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<GalleryImage>(
    product.gallery[0] || {
      src: product.image,
      alt: product.name,
      kind: "photo",
    }
  );

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    add(selectedVariant.id, qty, `${product.shortName} (${selectedVariant.label})`);
    track("add_to_cart", itemParams({
      sku: selectedVariant.sku,
      name: product.name,
      variant: selectedVariant.label,
      pricePaise: selectedVariant.pricePaise,
      qty,
    }));
  };

  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li>{product.name}</li>
          </ol>
        </div>

        <div className="pdp">
          {/* LEFT: GALLERY */}
          <div>
            <div className="gallery-main">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className={activeImage.kind === "lifestyle" ? "cover" : ""}
                style={{ objectFit: activeImage.kind === "lifestyle" ? "cover" : "contain" }}
                priority
              />
              <span className="badge badge-aqua gallery-caption">
                {activeImage.kind === "photo"
                  ? "Actual Bottle Photo"
                  : activeImage.kind === "lifestyle"
                  ? "Representative Lifestyle"
                  : "Vector Illustration"}
              </span>
            </div>

            <div className="gallery-thumbs">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={activeImage.src === img.src}
                  onClick={() => setActiveImage(img)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={100}
                    height={100}
                    className={img.kind === "lifestyle" ? "" : "contain"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: BUY BOX */}
          <div className="pdp-sticky">
            <span className="eyebrow">500 ml Packaged Drinking Water</span>
            <h1 style={{ fontSize: "var(--fs-2xl)" }}>{product.name}</h1>
            <p className="lead muted">{product.tagline}</p>

            <div className="mb-4">
              <span className="price" style={{ fontSize: "2rem" }}>
                {formatINR(selectedVariant?.pricePaise ?? 0)}
              </span>
              <span className="price-sub"> (₹10/bottle, incl. of all taxes)</span>
            </div>

            {/* VARIANT SELECTION */}
            <div className="field mb-4">
              <label className="label">Choose Pack Size:</label>
              <div className="options">
                {product.variants.map((v) => (
                  <label key={v.id} className="option">
                    <input
                      type="radio"
                      name="pack_variant"
                      value={v.id}
                      checked={selectedVariantId === v.id}
                      onChange={() => setSelectedVariantId(v.id)}
                    />
                    <div className="dot" />
                    <div className="grow">
                      <strong>{v.label}</strong> ({v.units} bottles)
                      <div className="small muted">{v.useCase}</div>
                    </div>
                    <div className="nowrap font-bold">
                      {formatINR(v.pricePaise)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* QUANTITY & ACTIONS */}
            <div className="row mb-5" style={{ gap: "12px" }}>
              <div className="qty">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={qty}
                  aria-label="Selected quantity"
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={qty >= 20}
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                Add {qty} Pack{qty > 1 ? "s" : ""} to Cart
              </button>
            </div>

            {/* TRUST SIGNALS IN BUY BOX */}
            <div className="trust-row mb-6">
              <div className="t">
                <IconTruck size={20} />
                <span>Local Kendrapara Doorstep Delivery</span>
              </div>
              <div className="t">
                <IconShield size={20} />
                <span>Sealed Hygienic Packaging</span>
              </div>
              <div className="t">
                <IconRefresh size={20} />
                <span>100% Recyclable PET Bottles</span>
              </div>
            </div>

            {/* PRODUCT SPECIFICATIONS */}
            <div>
              <h3>Verified Specifications</h3>
              <table className="spec-table">
                <tbody>
                  {product.specs.map((s, idx) => (
                    <tr key={idx}>
                      <th>{s.k}</th>
                      <td>{s.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

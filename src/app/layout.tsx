import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartToast, ConsentBanner } from "@/components/layout/Overlays";
import { business } from "@/config/business";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Zippyfeed — Kendrapara Packaged Drinking Water (500ml)",
    template: "%s | Zippyfeed Drinking Water",
  },
  description: "Zippyfeed Kendrapara Packaged Drinking Water — Pure & Safe, Natural Minerals, Refreshing Hydration. Order cases online or enquire for bulk delivery.",
  keywords: ["Packaged Drinking Water", "Zippyfeed", "Kendrapara Water", "500ml Water Bottle", "Bulk Water Delivery Odisha"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Zippyfeed Drinking Water",
    images: [{ url: "/images/hero.jpg", width: 1376, height: 768, alt: "Zippyfeed Packaged Drinking Water" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {business.previewMode && (
            <div className="preview-banner">
              ⚠️ Store Preview Mode: Pack sizes, delivery zones, & FSSAI licence are placeholders pending final business confirmation. <Link href="/about">Learn more</Link>
            </div>
          )}
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <CartToast />
          <ConsentBanner />
        </CartProvider>
      </body>
    </html>
  );
}

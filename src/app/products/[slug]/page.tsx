import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/server/catalog";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export async function generateStaticParams() {
  const products = listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Product Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Zippyfeed",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: (product.variants[0]?.pricePaise ?? 1000) / 100,
      highPrice: (product.variants[product.variants.length - 1]?.pricePaise ?? 48000) / 100,
      offerCount: product.variants.length,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="section">
      <div className="container container-narrow prose">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li>{post.title}</li>
          </ol>
        </div>

        <div className="mb-4">
          <span className="badge badge-aqua">{post.category}</span>
          <span className="small muted" style={{ marginLeft: "12px" }}>
            {post.date} • {post.readTime}
          </span>
        </div>

        <h1 style={{ marginBottom: "var(--sp-4)" }}>{post.title}</h1>
        <p className="lead" style={{ color: "var(--c-ink-2)", fontStyle: "italic", borderLeft: "4px solid var(--c-red)", paddingLeft: "16px" }}>
          {post.excerpt}
        </p>

        <div className="mt-6 stack">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="card mt-8" style={{ background: "var(--c-aqua-50)", border: "1px solid var(--c-aqua-100)" }}>
          <h3>Order Certified Mineral Water for Home or Office</h3>
          <p className="small muted mb-4">
            Enjoy pure, balanced hydration bottled locally in Kendrapara at ₹10 MRP with doorstep delivery.
          </p>
          <div className="row">
            <Link href="/shop" className="btn btn-primary btn-sm">
              Shop Bottle Packs
            </Link>
            <Link href="/contact" className="btn btn-outline btn-sm">
              Contact Sales (+91 8637213741)
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--c-line)" }}>
          <Link href="/blog" className="small muted">
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}

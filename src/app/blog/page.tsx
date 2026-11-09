import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Hydration Insights & News | Zippyfeed Blog",
  description: "Read expert guides on mineral hydration, event water planning, water storage tips, and local bottled water insights from Zippyfeed.",
};

export default function BlogIndexPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="breadcrumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li>Blog</li>
          </ol>
        </div>

        <div className="section-head">
          <span className="eyebrow">Hydration Science & Guides</span>
          <h1>Zippyfeed Water Journal</h1>
          <p className="lead muted">
            Expert articles on balanced mineral nutrition, event planning calculators, packaging hygiene, and everyday hydration habits.
          </p>
        </div>

        <div className="grid grid-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div className="row between mb-2">
                <span className="badge badge-aqua">{post.category}</span>
                <span className="xsmall muted">{post.readTime}</span>
              </div>
              <h2 style={{ fontSize: "1.25rem", margin: "8px 0" }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {post.title}
                </Link>
              </h2>
              <p className="small muted mb-4" style={{ flex: 1 }}>
                {post.excerpt}
              </p>
              <div className="row between mt-auto pt-3" style={{ borderTop: "1px solid var(--c-line)" }}>
                <span className="xsmall muted">{post.date}</span>
                <Link href={`/blog/${post.slug}`} className="small font-bold" style={{ color: "var(--c-red)" }}>
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

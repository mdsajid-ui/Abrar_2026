"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { IconCart, IconClose, IconMenu } from "@/components/ui/Icons";

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/quality", label: "Quality" },
  { href: "/bulk-orders", label: "Bulk & Events" },
  { href: "/blog", label: "Blog" },
  { href: "/distributors", label: "Distributors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Zippyfeed home">
      <span className="logo-mark" aria-hidden="true">Z</span>
      <span>
        Zippyfeed
        <small>Drinking Water</small>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { count, ready } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="site-header">
      <div className="container bar">
        <Logo />
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/track" className="btn btn-ghost btn-sm hide-mobile">Track order</Link>
          <Link href="/shop" className="btn btn-primary btn-sm header-cta">Order a case</Link>
          <Link href="/cart" className="icon-btn cart-btn" aria-label={`Cart, ${ready ? count : 0} items`}>
            <IconCart />
            {ready && count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
          </Link>
          <button
            className="icon-btn menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Mobile">
        <ul>
          {NAV.map((n) => (
            <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
          ))}
          <li><Link href="/track">Track order</Link></li>
          <li><Link href="/cart">Cart</Link></li>
        </ul>
      </nav>
    </header>
  );
}

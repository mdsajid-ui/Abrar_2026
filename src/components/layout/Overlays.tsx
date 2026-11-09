"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CONSENT_KEY } from "@/lib/analytics";
import { IconClose } from "@/components/ui/Icons";

export function CartToast() {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite" key={toast.id}>
      <span>{toast.text}</span>
      <Link href="/cart">View cart</Link>
      <button className="link-btn" style={{ color: "#fff" }} onClick={dismissToast} aria-label="Dismiss">
        <IconClose size={16} />
      </button>
    </div>
  );
}

/** Analytics consent. GA loads only if NEXT_PUBLIC_GA_ID is set AND the visitor accepts. */
export function ConsentBanner() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [state, setState] = useState<"unknown" | "granted" | "denied" | "loading">("loading");
  useEffect(() => {
    try {
      const v = localStorage.getItem(CONSENT_KEY);
      setState(v === "granted" || v === "denied" ? v : "unknown");
    } catch {
      setState("denied");
    }
  }, []);
  const choose = (v: "granted" | "denied") => {
    try { localStorage.setItem(CONSENT_KEY, v); } catch {}
    setState(v);
  };

  return (
    <>
      {state === "granted" && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {state === "unknown" && (
        <div className="consent" role="dialog" aria-label="Cookie preferences">
          <p className="mb-2"><strong>Help us improve this store?</strong></p>
          <p className="muted small">
            We&apos;d like to use analytics cookies to understand which pages help people shop. Essential storage (your cart) works either way.{" "}
            <Link href="/policies/privacy">Privacy policy</Link>
          </p>
          <div className="row">
            <button className="btn btn-dark btn-sm" onClick={() => choose("granted")}>Accept analytics</button>
            <button className="btn btn-outline btn-sm" onClick={() => choose("denied")}>Essential only</button>
          </div>
        </div>
      )}
    </>
  );
}

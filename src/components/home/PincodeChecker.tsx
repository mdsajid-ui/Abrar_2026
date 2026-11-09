"use client";

import { useState } from "react";
import { isPincode } from "@/lib/validation";
import { IconPin, IconCheck } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";
import { getPincode } from "@/data/catalog";
import Link from "next/link";

export function PincodeChecker() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    checked: boolean;
    serviceable?: boolean;
    area?: string;
    eta?: string;
    error?: string;
  }>({ checked: false });

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPincode(pin)) {
      setResult({ checked: true, error: "Please enter a valid 6-digit Indian PIN code." });
      return;
    }

    setLoading(true);
    setResult({ checked: false });

    // Client-side verification against verified service pincodes
    setTimeout(() => {
      const match = getPincode(pin);
      if (match) {
        setResult({
          checked: true,
          serviceable: true,
          area: match.area,
          eta: match.eta,
        });
        track("check_pincode", { pincode: pin, serviceable: true });
      } else {
        setResult({
          checked: true,
          serviceable: false,
        });
        track("check_pincode", { pincode: pin, serviceable: false });
      }
      setLoading(false);
    }, 250);
  };

  return (
    <div className="card" style={{ maxWidth: "480px" }}>
      <div className="row mb-2">
        <IconPin size={22} />
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Check Delivery Availability</h3>
      </div>
      <p className="small muted">
        We currently provide direct local doorstep case delivery in Kendrapara and surrounding zones.
      </p>

      <form onSubmit={handleCheck} className="row" style={{ alignItems: "stretch", gap: "8px" }}>
        <input
          type="text"
          className="input"
          placeholder="Enter 6-digit PIN (e.g. 754211)"
          value={pin}
          maxLength={6}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          style={{ flex: 1, minHeight: "44px" }}
        />
        <button type="submit" className="btn btn-dark btn-sm" disabled={loading} style={{ minHeight: "44px" }}>
          {loading ? "Checking..." : "Verify"}
        </button>
      </form>

      {result.checked && (
        <div className="mt-3">
          {result.error && <p className="error-text">{result.error}</p>}
          {result.serviceable ? (
            <div className="alert alert-success">
              <strong><IconCheck size={16} /> Delivery Available!</strong>
              <div className="small mt-1">
                Area: <strong>{result.area}</strong> • Estimated Arrival: <strong>{result.eta}</strong>
              </div>
            </div>
          ) : (
            result.serviceable === false && (
              <div className="alert alert-warn">
                <strong>Not in standard delivery zone yet.</strong>
                <div className="small mt-1">
                  We don&apos;t have standard retail delivery in this PIN code yet, but we do fulfill larger event/custom orders.{" "}
                  <Link href="/bulk-orders" style={{ fontWeight: 600 }}>Enquire for bulk quote</Link>.
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

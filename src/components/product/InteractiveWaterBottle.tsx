"use client";

import { useState } from "react";

interface InteractiveWaterBottleProps {
  className?: string;
  size?: number;
}

export function InteractiveWaterBottle({ className = "", size = 260 }: InteractiveWaterBottleProps) {
  const [isFilled, setIsFilled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Active if hovered on desktop or clicked/toggled on mobile/desktop
  const active = isHovered || isFilled;

  return (
    <div
      className={`interactive-bottle-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsFilled((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-label="Interactive water bottle: click or hover to fill with mineral water"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFilled((prev) => !prev);
        }
      }}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
      }}
    >
      <div
        className="bottle-svg-wrapper"
        style={{
          width: `${size * 0.42}px`,
          height: `${size}px`,
          position: "relative",
          filter: "drop-shadow(0 12px 24px rgba(15, 27, 45, 0.12))",
          transition: "transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)",
          transform: active ? "scale(1.03) translateY(-4px)" : "scale(1)",
        }}
      >
        <svg
          viewBox="0 0 240 600"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bottle Glass Profile */}
            <clipPath id="interactiveBottleBody">
              <path d="M92 70 h56 v22 c0 14 36 34 36 74 v370 c0 22 -14 34 -34 34 h-60 c-20 0 -34 -12 -34 -34 v-370 c0 -40 36 -60 36 -74z" />
            </clipPath>

            {/* Liquid Fill Gradient */}
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7ecae6" />
              <stop offset="35%" stopColor="#b6e7f7" />
              <stop offset="70%" stopColor="#92d9f0" />
              <stop offset="100%" stopColor="#6cbdd9" />
            </linearGradient>

            {/* Wave Surface Pattern */}
            <linearGradient id="surfaceHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#b6e7f7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Bottom shadow */}
          <ellipse cx="120" cy="582" rx="72" ry="9" fill="#0f1b2d" opacity="0.1" />

          {/* Glass Outer Shell */}
          <path
            d="M92 70 h56 v22 c0 14 36 34 36 74 v370 c0 22 -14 34 -34 34 h-60 c-20 0 -34 -12 -34 -34 v-370 c0 -40 36 -60 36 -74z"
            fill="#f0f9fc"
            stroke="#aed3e3"
            strokeWidth="3"
            opacity="0.85"
          />

          {/* Liquid Masked to Bottle Silhouette */}
          <g clipPath="url(#interactiveBottleBody)">
            {/* Dynamic Liquid Column: y starts low (480 = ~20%) and rises to 150 (~92%) */}
            <g
              className="liquid-group"
              style={{
                transform: active ? "translateY(0px)" : "translateY(280px)",
                transition: "transform 1.1s cubic-bezier(0.34, 1.25, 0.64, 1)",
              }}
            >
              {/* Main Liquid Body */}
              <rect
                x="40"
                y="140"
                width="160"
                height="460"
                fill="url(#liquidGrad)"
                opacity="0.8"
              />

              {/* Animated Liquid Wave Crest */}
              <path
                d="M40 140 Q 65 132, 90 140 T 140 140 T 190 140 T 210 140 L 210 160 L 40 160 Z"
                fill="url(#surfaceHighlight)"
                className={active ? "wave-motion" : ""}
              />

              {/* Effervescent Rising Micro-Bubbles */}
              {active && (
                <g className="bubbles-group" opacity="0.75">
                  <circle cx="85" cy="380" r="3.5" fill="#ffffff" className="bubble-1" />
                  <circle cx="140" cy="420" r="2.5" fill="#ffffff" className="bubble-2" />
                  <circle cx="110" cy="310" r="4" fill="#ffffff" className="bubble-3" />
                  <circle cx="155" cy="240" r="3" fill="#ffffff" className="bubble-1" />
                  <circle cx="95" cy="200" r="2" fill="#ffffff" className="bubble-2" />
                </g>
              )}
            </g>

            {/* Zippyfeed Real Brand Label */}
            <rect x="52" y="240" width="136" height="230" fill="#ffffff" rx="4" />
            <rect x="52" y="240" width="136" height="230" fill="none" stroke="#d2382f" strokeWidth="2.5" rx="4" />
            <rect x="52" y="240" width="136" height="9" fill="#d2382f" />
            <rect x="52" y="461" width="136" height="9" fill="#d2382f" />

            {/* Logo Z mark */}
            <rect x="70" y="260" width="18" height="18" rx="3" fill="#d2382f" />
            <text x="79" y="274" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="14" fill="#ffffff">
              Z
            </text>
            <text x="94" y="274" fontFamily="sans-serif" fontWeight="700" fontSize="15" fill="#0f1b2d">
              ippyfeed
            </text>

            {/* Packaged Drinking Water */}
            <text x="120" y="306" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="12" fill="#d2382f">
              PACKAGED
            </text>
            <text x="120" y="322" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="9.5" fill="#0f1b2d">
              DRINKING WATER
            </text>

            {/* Water Drop Graphic */}
            <circle cx="120" cy="358" r="16" fill="#1f8fb3" opacity="0.15" />
            <path d="M120 346 c-6 9 -10 15 -10 20 a10 10 0 0 0 20 0 c0 -5 -4 -11 -10 -20z" fill="#1f8fb3" />

            {/* 500 ml text */}
            <text x="120" y="415" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="16" fill="#0f1b2d">
              500 ml
            </text>
            <text x="120" y="432" textAnchor="middle" fontFamily="sans-serif" fontWeight="600" fontSize="9" fill="#d2382f">
              MRP ₹10 (incl. taxes)
            </text>

            {/* Glass Glare / Refraction Highlight */}
            <path
              d="M60 80 L76 80 L76 560 L60 560 Z"
              fill="#ffffff"
              opacity="0.35"
            />
          </g>

          {/* Neck Ring & Cap */}
          <rect x="88" y="62" width="64" height="10" rx="3" fill="#e8f2f6" stroke="#b7d6e2" strokeWidth="2" />
          <rect x="92" y="20" width="56" height="44" rx="5" fill="#ffffff" stroke="#c9d6de" strokeWidth="2" />
          {/* Cap ridges */}
          <line x1="102" y1="26" x2="102" y2="58" stroke="#d5dce2" strokeWidth="2" />
          <line x1="111" y1="26" x2="111" y2="58" stroke="#d5dce2" strokeWidth="2" />
          <line x1="120" y1="26" x2="120" y2="58" stroke="#d5dce2" strokeWidth="2" />
          <line x1="129" y1="26" x2="129" y2="58" stroke="#d5dce2" strokeWidth="2" />
          <line x1="138" y1="26" x2="138" y2="58" stroke="#d5dce2" strokeWidth="2" />
        </svg>
      </div>

      {/* Interactive Guidance Tag */}
      <div
        className="bottle-fill-tag"
        style={{
          marginTop: "12px",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: active ? "var(--c-aqua-ink)" : "var(--c-muted)",
          background: active ? "var(--c-aqua-50)" : "var(--c-mist)",
          padding: "4px 12px",
          borderRadius: "var(--r-pill)",
          border: `1px solid ${active ? "var(--c-aqua-100)" : "var(--c-line)"}`,
          transition: "all 0.3s ease",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: active ? "var(--c-aqua)" : "var(--c-line-2)",
            transform: active ? "scale(1.2)" : "scale(1)",
            transition: "all 0.3s ease",
          }}
        />
        {active ? "100% Filled • Pure & Safe" : "Tap or Hover to Fill"}
      </div>
    </div>
  );
}

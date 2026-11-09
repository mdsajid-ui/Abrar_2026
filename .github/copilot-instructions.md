# UI / UX Pro Max — Project Guidelines for GitHub Copilot & AI Assistants

This repository follows the **UI / UX Pro Max** design intelligence framework.

## Key Design & Code Rules
1. **Aesthetic Standards**: Maintain clean, minimal, luxury-tier visual quality. Avoid generic or flat UI templates.
2. **Color Balance (60-30-10)**:
   - 60% Dominant: Clean soft whites, pearl mist, and subtle aqua gradients.
   - 30% Structural: Dark ink typography (`#0f1b2d`), frosted glass cards (`backdrop-filter: blur(16px)`).
   - 10% Accent: Vivid brand red (`#d2382f`) for primary actions; cyan/aqua (`#1f8fb3`) for hydration cues.
3. **Typography**: Oversized high-contrast display headlines with fluid `clamp(...)` sizing.
4. **Motion & 3D**:
   - Always use smooth easing (`cubic-bezier(0.2, 0.7, 0.2, 1)`) and lerp-damped parallax.
   - Ensure WebGL scenes cleanly dispose of geometries, materials, and requestAnimationFrame loops.
   - Respect `prefers-reduced-motion`.
5. **Accessibility**: All interactive buttons must have at least 44px touch targets and visible focus indicators.

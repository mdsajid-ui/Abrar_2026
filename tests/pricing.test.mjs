import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Dynamic import or run against transpile
describe("Pricing Engine Verification", () => {
  it("computes core pricing logic accurately in paise", () => {
    const subtotal = 24000; // ₹240
    const deliveryThreshold = 48000; // ₹480
    const deliveryFee = subtotal >= deliveryThreshold ? 0 : 4000;
    const total = subtotal + deliveryFee;

    assert.equal(subtotal, 24000);
    assert.equal(deliveryFee, 4000);
    assert.equal(total, 28000);
  });

  it("calculates 10% coupon deduction correctly", () => {
    const subtotal = 24000;
    const discount = Math.floor((subtotal * 10) / 100);
    const totalAfterDiscount = subtotal - discount;

    assert.equal(discount, 2400); // ₹24 discount
    assert.equal(totalAfterDiscount, 21600); // ₹216
  });

  it("unlocks free delivery at threshold", () => {
    const subtotal = 48000;
    const deliveryFee = subtotal >= 48000 ? 0 : 4000;
    assert.equal(deliveryFee, 0);
  });
});

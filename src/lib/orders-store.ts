import { computeQuote, formatINR, type CartLineInput, type Quote } from "./pricing";
import {
  getCoupon,
  getPricingSettings,
  getPricingVariants,
  getPincode,
  isCodEnabled,
  PRODUCTS,
} from "@/data/catalog";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  STATUS_LABEL,
  type Order,
  type OrderEvent,
  type OrderItem,
  type OrderStatus,
  type PaymentStatus,
} from "./orders-types";

export * from "./orders-types";

const STORAGE_KEY = "zf_orders_v1";

export function sanitizeLines(raw: unknown): CartLineInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 50)
    .map((l) => ({
      variantId: Number((l as CartLineInput)?.variantId),
      qty: Number((l as CartLineInput)?.qty),
    }))
    .filter((l) => Number.isInteger(l.variantId) && Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 999);
}

export function quoteCart(lines: CartLineInput[], couponCode?: string | null): Quote {
  const ids = lines.map((l) => l.variantId);
  return computeQuote(
    lines,
    getPricingVariants(ids),
    getPricingSettings(),
    getCoupon(couponCode),
    couponCode || null,
  );
}

function genPublicId(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const dt = new Date();
  const ymd = `${String(dt.getFullYear()).slice(2)}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}`;
  return `ZF-${ymd}-${s}`;
}

const memoryOrders: Order[] = [
  {
    id: 1,
    publicId: "ZF-2610-DEMO1",
    accessToken: "tok_demo1",
    status: "confirmed",
    paymentMethod: "cod",
    paymentStatus: "cod_pending",
    paymentMode: "none",
    name: "Abrar Mohammed",
    phone: "8637213741",
    email: "abrar@zippyfeed.com",
    address1: "Main Road, Near Bus Stand",
    address2: "Shop #14",
    landmark: "Kendrapara Market",
    city: "Kendrapara",
    state: "Odisha",
    pincode: "754211",
    notes: "Leave with security if not at desk",
    subtotalPaise: 24000,
    deliveryFeePaise: 0,
    discountPaise: 0,
    taxIncludedPaise: 3661,
    totalPaise: 24000,
    couponCode: null,
    gatewayOrderId: null,
    gatewayPaymentId: null,
    stockReleased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 1,
        variantId: 2,
        productId: 1,
        productName: "Zippyfeed Packaged Drinking Water — 500 ml",
        variantLabel: "Case of 24",
        sku: "ZF-500-24",
        units: 24,
        unitPricePaise: 24000,
        qty: 1,
        lineTotalPaise: 24000,
      },
    ],
    events: [
      {
        id: 1,
        type: "order_created",
        note: "Initial order registered",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

export function listOrders(opts: { limit?: number } = {}): Order[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Order[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, opts.limit ?? 50);
        }
      }
    } catch {
      // Fallback to memory
    }
  }
  return memoryOrders.slice(0, opts.limit ?? 50);
}

export function getOrderForCustomer(publicId: string, token?: string | null): Order | null {
  const orders = listOrders({ limit: 100 });
  const found = orders.find(
    (o) => o.publicId.toUpperCase() === publicId.toUpperCase() && (!token || o.accessToken === token),
  );
  return found ?? null;
}

export function saveOrderToStorage(order: Order): void {
  if (typeof window === "undefined") {
    memoryOrders.unshift(order);
    return;
  }
  try {
    const list = listOrders({ limit: 100 });
    const idx = list.findIndex((o) => o.publicId === order.publicId);
    if (idx >= 0) {
      list[idx] = order;
    } else {
      list.unshift(order);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save order to localStorage:", err);
  }
}

export function createLocalOrder(input: {
  lines: CartLineInput[];
  couponCode?: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address1: string;
    address2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
    paymentMethod: "online" | "cod";
  };
}): { ok: true; order: Order; next: string } | { ok: false; error: string } {
  const sanitized = sanitizeLines(input.lines);
  if (!sanitized.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const quote = quoteCart(sanitized, input.couponCode);
  if (!quote.canCheckout) {
    return { ok: false, error: quote.errors[0] || "Cannot checkout with current cart." };
  }

  const cust = input.customer;
  if (!cust.name?.trim() || !cust.phone?.trim() || !cust.address1?.trim() || !cust.pincode?.trim()) {
    return { ok: false, error: "Please fill in all required delivery details." };
  }

  const publicId = genPublicId();
  const token = `tok_${Math.random().toString(36).substring(2, 10)}`;
  const now = new Date().toISOString();

  const variantsMap = getPricingVariants();
  const items: OrderItem[] = quote.lines.map((l, i) => {
    const v = variantsMap.get(l.variantId);
    return {
      id: i + 1,
      variantId: l.variantId,
      productId: v?.productId ?? 1,
      productName: l.productName,
      variantLabel: l.label,
      sku: v ? `ZF-500-${l.units}` : "ZF-500",
      units: l.units,
      unitPricePaise: l.unitPricePaise,
      qty: l.qty,
      lineTotalPaise: l.lineTotalPaise,
    };
  });

  const isCod = cust.paymentMethod === "cod";
  const order: Order = {
    id: Date.now(),
    publicId,
    accessToken: token,
    status: isCod ? "confirmed" : "pending_payment",
    paymentMethod: cust.paymentMethod,
    paymentStatus: isCod ? "cod_pending" : "pending",
    paymentMode: isCod ? "cod" : "online_simulator",
    name: cust.name.trim(),
    phone: cust.phone.trim(),
    email: cust.email?.trim() || null,
    address1: cust.address1.trim(),
    address2: cust.address2?.trim() || null,
    landmark: cust.landmark?.trim() || null,
    city: cust.city.trim() || "Kendrapara",
    state: cust.state.trim() || "Odisha",
    pincode: cust.pincode.trim(),
    notes: cust.notes?.trim() || null,
    subtotalPaise: quote.subtotalPaise,
    deliveryFeePaise: quote.deliveryFeePaise,
    discountPaise: quote.discountPaise,
    taxIncludedPaise: quote.taxIncludedPaise,
    totalPaise: quote.totalPaise,
    couponCode: quote.couponCode,
    gatewayOrderId: null,
    gatewayPaymentId: null,
    stockReleased: false,
    createdAt: now,
    updatedAt: now,
    items,
    events: [
      {
        id: 1,
        type: isCod ? "order_confirmed" : "order_created",
        note: isCod ? "Placed via Cash on Delivery" : "Placed awaiting online verification",
        createdAt: now,
      },
    ],
  };

  saveOrderToStorage(order);

  const next = isCod
    ? `/order/?id=${publicId}&t=${token}`
    : `/checkout/pay/?id=${publicId}&t=${token}`;

  return { ok: true, order, next };
}

export function updateOrderStatus(
  publicId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus,
  note?: string,
): boolean {
  const orders = listOrders({ limit: 100 });
  const order = orders.find((o) => o.publicId === publicId);
  if (!order) return false;

  order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();
  if (note) {
    order.events.push({
      id: order.events.length + 1,
      type: `status_${status}`,
      note,
      createdAt: new Date().toISOString(),
    });
  }
  saveOrderToStorage(order);
  return true;
}

export function getWhatsAppOrderUrl(order: Order): string {
  const businessPhone = "918637213741";
  const itemsText = order.items
    .map((it) => `• ${it.qty}x ${it.variantLabel} (${it.productName}) - ${formatINR(it.lineTotalPaise)}`)
    .join("\n");

  const message = `*New Water Order via Zippyfeed Website*
Order ID: *${order.publicId}*
Customer: *${order.name}*
Phone: *${order.phone}*
Address: ${order.address1}, ${order.city} - ${order.pincode}
Payment Method: *${order.paymentMethod.toUpperCase()}*

*Items:*
${itemsText}

*Subtotal:* ${formatINR(order.subtotalPaise)}
*Delivery:* ${order.deliveryFeePaise === 0 ? "FREE" : formatINR(order.deliveryFeePaise)}
*Total Amount:* *${formatINR(order.totalPaise)}*

Please confirm delivery dispatch!`;

  return `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;
}

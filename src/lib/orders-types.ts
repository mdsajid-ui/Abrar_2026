import type { CartLineInput, Quote } from "./pricing";

export const ORDER_STATUSES = [
  "pending_payment",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "cod_pending",
  "cod_collected",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  confirmed: "Confirmed",
  processing: "Being packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  cod_pending: "Cash on delivery",
  cod_collected: "Cash collected",
  refunded: "Refunded",
};

export type OrderItem = {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  variantLabel: string;
  sku: string;
  units: number;
  unitPricePaise: number;
  qty: number;
  lineTotalPaise: number;
};

export type OrderEvent = {
  id: number;
  type: string;
  note: string | null;
  createdAt: string;
};

export type Order = {
  id: number;
  publicId: string;
  accessToken: string;
  status: OrderStatus;
  paymentMethod: "online" | "cod";
  paymentStatus: PaymentStatus;
  paymentMode: string;
  name: string;
  phone: string;
  email: string | null;
  address1: string;
  address2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  subtotalPaise: number;
  deliveryFeePaise: number;
  discountPaise: number;
  taxIncludedPaise: number;
  totalPaise: number;
  couponCode: string | null;
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  stockReleased: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  events: OrderEvent[];
};

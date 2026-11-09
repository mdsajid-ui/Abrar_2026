import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "zf_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string | null {
  const s = process.env.SESSION_SECRET?.trim();
  return s && s.length >= 16 ? s : null;
}

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD?.trim() && !!secret();
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()!).update(payload).digest("hex");
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  const a = crypto.createHash("sha256").update(String(input)).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function createAdminSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [who, expStr, sig] = parts;
  const payload = `${who}.${expStr}`;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(expStr) > Date.now() / 1000;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "smilecraftdental@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ibrahimghani";
const SESSION_SECRET = process.env.SESSION_SECRET || "smilecraft_admin_secret_key_2026";

export interface AdminSession {
  token: string;
  email: string;
  createdAt: string;
}

// Create a session token
export function createSessionToken(email: string): string {
  const data = `${email}:${Date.now()}:${Math.random()}`;
  return crypto.createHash("sha256").update(data + SESSION_SECRET).digest("hex");
}

// Verify token integrity
export function verifySessionToken(token: string, email: string): boolean {
  const expectedToken = createSessionToken(email);
  // Note: This is a basic check. For production, store tokens with expiry in database
  return token.length > 0 && token.length === expectedToken.length;
}

// Validate login credentials
export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

// Create session
export async function createAdminSession(email: string): Promise<string> {
  const token = createSessionToken(email);
  const cookieStore = await cookies();
  
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return token;
}

// Get session
export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value || null;
}

// Logout
export async function logoutAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

// Verify session exists and is valid
export async function verifyAdminSession(): Promise<boolean> {
  const session = await getAdminSession();
  // In production, also validate against stored sessions in database
  // For now, just check existence
  return !!session;
}

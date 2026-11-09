import { createHmac, timingSafeEqual } from "node:crypto";

type Payload = { eid: string; exp: number; iat: number };

function getSecret(): string {
  const s = process.env.QR_SIGNING_SECRET || process.env.ENRUTA_SECRET_KEY || "dev-qr-secret-change-in-production";
  return s;
}

function b64url(input: Buffer | string): string {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 2 ? "==" : s.length % 4 === 3 ? "=" : "";
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signCheckInToken(establecimientoId: string, ttlSeconds = 15 * 60): { token: string; exp: number } {
  const now = Math.floor(Date.now() / 1000);
  const payload: Payload = { eid: establecimientoId, exp: now + ttlSeconds, iat: now };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", getSecret()).update(body).digest());
  return { token: `${body}.${sig}`, exp: payload.exp };
}

export function verifyCheckInToken(token: string): { ok: true; establecimientoId: string } | { ok: false; error: string } {
  try {
    const [body, sig] = String(token || "").split(".");
    if (!body || !sig) return { ok: false, error: "token_malformed" };
    const expected = b64url(createHmac("sha256", getSecret()).update(body).digest());
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, error: "token_invalid" };
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as Payload;
    if (!payload.eid || !payload.exp) return { ok: false, error: "token_payload_invalid" };
    if (Math.floor(Date.now() / 1000) > payload.exp) return { ok: false, error: "token_expired" };
    return { ok: true, establecimientoId: payload.eid };
  } catch {
    return { ok: false, error: "token_invalid" };
  }
}

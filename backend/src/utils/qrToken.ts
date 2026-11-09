import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

type Payload = { eid: string; exp: number; iat: number; jti?: string };

// Anti-replay MVP (in-memory, no distribuido; Redis/D8 para prod multi-instancia)
const used = new Map<string, number>(); // jti -> exp
function gc() {
  const now = Math.floor(Date.now() / 1000);
  for (const [k, exp] of used) if (exp <= now) used.delete(k);
}

function getSecret(): string {
  return process.env.QR_SIGNING_SECRET || "dev-qr-secret-change-in-production";
}

function b64url(input: Buffer | string): string {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 2 ? "==" : s.length % 4 === 3 ? "=" : "";
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signCheckInToken(establecimientoId: string, ttlSeconds = 15 * 60): { token: string; exp: number; jti: string } {
  const now = Math.floor(Date.now() / 1000);
  const payload: Payload = { eid: establecimientoId, exp: now + ttlSeconds, iat: now, jti: randomUUID() };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", getSecret()).update(body).digest());
  return { token: `${body}.${sig}`, exp: payload.exp, jti: payload.jti! };
}

function verifyBase(token: string): { ok: true; payload: Payload } | { ok: false; error: string } {
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
    return { ok: true, payload };
  } catch {
    return { ok: false, error: "token_invalid" };
  }
}

export function verifyCheckInToken(token: string): { ok: true; establecimientoId: string } | { ok: false; error: string } {
  const v = verifyBase(token);
  if (!v.ok) return v;
  return { ok: true, establecimientoId: v.payload.eid };
}

// Verifica y consume (anti-replay). Tokens legacy sin jti: válidos solo por firma+exp.
export function verifyAndConsumeCheckInToken(token: string): { ok: true; establecimientoId: string } | { ok: false; error: string } {
  const v = verifyBase(token);
  if (!v.ok) return v;
  if (v.payload.jti) {
    gc();
    if (used.has(v.payload.jti)) return { ok: false, error: "token_replayed" };
    used.set(v.payload.jti, v.payload.exp);
  }
  return { ok: true, establecimientoId: v.payload.eid };
}


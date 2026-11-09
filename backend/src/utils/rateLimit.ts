import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(opts: { windowMs: number; max: number; key?: (req: Request) => string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = (opts.key ? opts.key(req) : req.ip || "unknown") + ":" + req.path;
    const now = Date.now();
    const b = buckets.get(key);
    if (!b || now >= b.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }
    b.count += 1;
    if (b.count > opts.max) {
      res.setHeader("Retry-After", Math.ceil((b.resetAt - now) / 1000));
      return res.status(429).json({ error: "rate_limit_exceeded", contract_version: "parada-viva-api/0.1" });
    }
    next();
  };
}

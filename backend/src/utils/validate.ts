import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const r = schema.safeParse(req.body);
    if (!r.success) {
      return res.status(400).json({
        error: "validation_error",
        details: r.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        contract_version: "parada-viva-api/0.1",
      });
    }
    req.body = r.data as any;
    next();
  };
}

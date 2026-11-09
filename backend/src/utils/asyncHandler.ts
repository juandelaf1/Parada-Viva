import type { Request, Response, NextFunction, RequestHandler } from "express";

// Express 4 no captura rechazos async: este wrapper los envía al error handler.
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Auditoría de accesos sensibles sin PII (pre-D8). Tipos laxos para no acoplar a express en el util.
export type AccessActor = {
  kind: "anon" | "stub_email_header" | "report_key_header" | "role_stub" | "unknown";
  role?: string;
};

function actorFromReq(req: any): AccessActor {
  // No PII: nunca loguear valores (emails/tokens/ids). Solo presencia/tipo.
  const role = req.headers?.["x-user-role"];
  if (typeof role === "string" && role.trim()) {
    return { kind: "role_stub", role: role.trim().slice(0, 32) };
  }
  if (req.headers?.["x-report-key"]) return { kind: "report_key_header" };
  if (req.headers?.["x-user-email"]) return { kind: "stub_email_header" };
  return { kind: "anon" };
}

export function isSensitivePath(path: string, method: string): boolean {
  if (path.startsWith("/api/reports")) return true;
  if (path === "/api/check-ins/mis-checkins") return true;
  if (path.startsWith("/api/check-ins/qr/")) return true;
  if (path === "/api/auth/login" && method === "POST") return true;
  if (path === "/api/auth/me") return true;
  // writes sobre datos de usuario/actividad
  if (path === "/api/check-ins" && method === "POST") return true;
  if (path === "/api/valoraciones" && method === "POST") return true;
  return false;
}

export function accessAuditMiddleware(req: any, res: any, next: any) {
  if (process.env.ACCESS_AUDIT === "off") return next();
  const start = Date.now();
  res.on("finish", () => {
    try {
      const path = req.path || (req.originalUrl || "").split("?")[0] || "unknown";
      if (!isSensitivePath(path, req.method)) return;
      const entry = {
        event: "access_audit",
        service: "parada-viva-api",
        contract_version: "parada-viva-api/0.1",
        method: req.method,
        path, // sin query (evita filtrar usuarioId/email)
        status: res.statusCode,
        duration_ms: Date.now() - start,
        correlation_id: req.correlationId || res.getHeader?.("X-Correlation-Id"),
        actor: actorFromReq(req),
        pii: "none",
        auth_mode: process.env.AUTH_MODE || "stub",
      };
      // stdout estructurado; en prod redirigir a sink centralizado (backlog)
      console.log(JSON.stringify(entry));
    } catch {
      // auditoría no debe romper respuesta
    }
  });
  next();
}

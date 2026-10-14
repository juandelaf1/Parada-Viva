const API = "http://localhost:3001";

export type Usuario = {
  id: string;
  email: string;
  nombre: string | null;
  rol: string;
};

export function getUsuario(): Usuario | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("pv_usuario");
  return raw ? JSON.parse(raw) : null;
}

export function setUsuario(u: Usuario) {
  localStorage.setItem("pv_usuario", JSON.stringify(u));
}

export function logout() {
  localStorage.removeItem("pv_usuario");
}

export async function login(email: string, nombre?: string): Promise<Usuario> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, nombre }),
  });
  if (!res.ok) throw new Error("Error al iniciar sesión");
  const usuario = await res.json();
  setUsuario(usuario);
  return usuario;
}

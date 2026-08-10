import type { AppUser } from "@/data/types";

export interface Session {
  user: AppUser;
}

export interface AuthService {
  /** Login mock: acepta cualquier email/contraseña y arma una sesión de dueño. */
  login(input: { email: string; password: string }): Promise<Session>;
  /** Atajo para los botones "Entrar como demo" (dueño / gerente / vendedor). */
  loginAsDemo(userId: string): Promise<Session>;
  logout(): Promise<void>;
  getSession(): Session | null;
}

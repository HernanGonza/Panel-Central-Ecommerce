import type { AppUser } from "@/data/types";
import { users } from "@/data/fixtures/users";
import type { AuthService, Session } from "@/auth/types";

const STORAGE_KEY = "panel-central.session";

function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeStoredSession(session: Session | null): void {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

function ownerUser(email: string): AppUser {
  const label = email.split("@")[0] || "Usuario";
  const name = label.charAt(0).toUpperCase() + label.slice(1);
  return { id: `owner-${label}`, name, role: "dueño", storeIds: [], status: "activo" };
}

export const memoryAuthService: AuthService = {
  async login({ email }) {
    const session: Session = { user: ownerUser(email) };
    writeStoredSession(session);
    return session;
  },
  async loginAsDemo(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error(`Usuario demo "${userId}" no encontrado`);
    const session: Session = { user };
    writeStoredSession(session);
    return session;
  },
  async logout() {
    writeStoredSession(null);
  },
  getSession() {
    return readStoredSession();
  },
};

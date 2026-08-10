import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate, type Location } from "react-router-dom";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/useAuth";
import { homePathForUser } from "@/auth/paths";
import { users } from "@/data/fixtures/users";
import { ROLE_LABEL } from "@/data/types";
import { stores } from "@/data/fixtures/stores";

const DEMO_USER_IDS = ["aperez", "mdiaz", "jrohm"];

function storeNames(storeIds: string[]): string {
  if (storeIds.length === 0) return "Todas las tiendas";
  return storeIds.map((id) => stores.find((s) => s.id === id)?.name ?? id).join(", ");
}

export function LoginPage() {
  const { session, login, loginAsDemo, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingDemoId, setPendingDemoId] = useState<string | null>(null);

  if (session) {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from?.pathname ?? homePathForUser(session.user)} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login({ email, password });
    navigate("/", { replace: true });
  }

  async function handleDemoLogin(userId: string) {
    setPendingDemoId(userId);
    try {
      await loginAsDemo(userId);
      navigate("/", { replace: true });
    } finally {
      setPendingDemoId(null);
    }
  }

  const demoUsers = DEMO_USER_IDS.map((id) => users.find((u) => u.id === id)).filter(
    (u) => u !== undefined,
  );

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[image:var(--gradient-ink)] text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">Panel Central</h1>
            <p className="text-sm text-muted-foreground">Iniciá sesión para continuar</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vos@negocio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Entrar
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative text-center text-xs text-muted-foreground">
            <span className="relative bg-background px-2">o entrá como demo</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border" />
          </div>
          <div className="mt-4 space-y-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleDemoLogin(user.id)}
                disabled={pendingDemoId !== null}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary disabled:opacity-60"
              >
                <span>
                  <span className="block text-sm font-medium text-foreground">{user.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {ROLE_LABEL[user.role]} · {storeNames(user.storeIds)}
                  </span>
                </span>
                {pendingDemoId === user.id && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/useAuth";

export interface SidebarNavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

export function Sidebar({
  brand,
  items,
  footer,
}: {
  brand: ReactNode;
  items: SidebarNavItem[];
  footer?: ReactNode;
}) {
  const { session, logout } = useAuth();

  return (
    <aside className="flex h-svh w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2.5 px-5 py-5">{brand}</div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {footer}

      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{session?.user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{session?.user.role}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Cerrar sesión"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}

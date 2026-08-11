import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Store,
  Package,
  Boxes,
  ClipboardList,
  Users,
  Receipt,
  BarChart3,
  UserCog,
  Factory,
  Truck,
  Menu,
} from "lucide-react";
import { Sidebar, type SidebarNavItem } from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";

const ADMIN_NAV: SidebarNavItem[] = [
  { to: "/admin/general", label: "Panel general", icon: <LayoutDashboard className="size-4" /> },
  { to: "/admin/tiendas", label: "Tiendas", icon: <Store className="size-4" /> },
  { to: "/admin/productos", label: "Productos", icon: <Package className="size-4" /> },
  { to: "/admin/proveedores", label: "Proveedores", icon: <Factory className="size-4" /> },
  { to: "/admin/envios", label: "Proveedores de envío", icon: <Truck className="size-4" /> },
  { to: "/admin/stock", label: "Stock", icon: <Boxes className="size-4" /> },
  { to: "/admin/pedidos", label: "Pedidos", icon: <ClipboardList className="size-4" /> },
  { to: "/admin/clientes", label: "Clientes", icon: <Users className="size-4" /> },
  { to: "/admin/facturacion", label: "Facturación", icon: <Receipt className="size-4" /> },
  { to: "/admin/reportes", label: "Reportes", icon: <BarChart3 className="size-4" /> },
  { to: "/admin/usuarios", label: "Usuarios", icon: <UserCog className="size-4" /> },
];

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-svh bg-background">
      <Sidebar
        brand={
          <>
            <span className="flex size-8 items-center justify-center rounded-lg bg-[image:var(--gradient-ink)] text-primary-foreground">
              <Building2 className="size-4" />
            </span>
            <span className="font-display text-sm font-semibold text-foreground">Panel dueño</span>
          </>
        }
        items={ADMIN_NAV}
        mobileOpen={mobileNavOpen}
        onMobileOpenChange={setMobileNavOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
          <span className="flex size-7 items-center justify-center rounded-lg bg-[image:var(--gradient-ink)] text-primary-foreground">
            <Building2 className="size-3.5" />
          </span>
          <span className="truncate font-display text-sm font-semibold text-foreground">
            Panel dueño
          </span>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

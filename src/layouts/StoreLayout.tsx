import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Package, Boxes, Users, BarChart3, Store, ArrowLeft } from "lucide-react";
import { Sidebar, type SidebarNavItem } from "@/components/shared/Sidebar";
import { repositories } from "@/data/repositories";
import { useAuth } from "@/auth/useAuth";
import { isOwnerRole } from "@/data/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StoreLayout() {
  const { storeId } = useParams<{ storeId: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: () => repositories.stores.list(),
  });

  if (!storeId) return <Navigate to="/" replace />;

  const store = stores?.find((s) => s.id === storeId);
  const owner = session ? isOwnerRole(session.user.role) : false;

  const nav: SidebarNavItem[] = [
    { to: `/tienda/${storeId}/pedidos`, label: "Pedidos", icon: <ClipboardList className="size-4" /> },
    { to: `/tienda/${storeId}/catalogo`, label: "Catálogo", icon: <Package className="size-4" /> },
    { to: `/tienda/${storeId}/stock`, label: "Stock", icon: <Boxes className="size-4" /> },
    { to: `/tienda/${storeId}/clientes`, label: "Clientes", icon: <Users className="size-4" /> },
    { to: `/tienda/${storeId}/reportes`, label: "Reportes", icon: <BarChart3 className="size-4" /> },
  ];

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar
        brand={
          <>
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Store className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-semibold text-foreground">
                {store?.name ?? "Tienda"}
              </span>
              <span className="block text-[11px] text-muted-foreground">Panel de tienda</span>
            </span>
          </>
        }
        items={nav}
        footer={
          owner ? (
            <div className="space-y-2 border-t border-border px-3 py-3">
              <button
                type="button"
                onClick={() => navigate("/admin/general")}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Volver al panel general
              </button>
              <Select value={storeId} onValueChange={(next) => navigate(`/tienda/${next}/pedidos`)}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Cambiar de tienda" />
                </SelectTrigger>
                <SelectContent>
                  {stores?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : undefined
        }
      />
      <main className="min-w-0 flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

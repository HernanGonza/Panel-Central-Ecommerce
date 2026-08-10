import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import type { Role } from "@/data/types";

/** Bloquea una sección del panel de tienda (ej. Stock/Reportes) para roles sin permiso, aunque tipeen la URL a mano. */
export function RequireStorePermission({ check }: { check: (role: Role) => boolean }) {
  const { session } = useAuth();
  const { storeId } = useParams<{ storeId: string }>();

  if (!session) return <Navigate to="/login" replace />;
  if (!check(session.user.role)) {
    return <Navigate to={`/tienda/${storeId}/pedidos`} replace />;
  }

  return <Outlet />;
}

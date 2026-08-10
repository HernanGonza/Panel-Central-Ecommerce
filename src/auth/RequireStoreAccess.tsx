import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { isOwnerRole } from "@/data/types";
import { homePathForUser } from "@/auth/paths";

/**
 * Protege /tienda/:storeId/*: dueño/administrador entran a cualquier tienda,
 * gerente/vendedor solo a la propia.
 */
export function RequireStoreAccess() {
  const { session } = useAuth();
  const { storeId } = useParams<{ storeId: string }>();

  if (!session) return <Navigate to="/login" replace />;

  const { user } = session;
  const allowed =
    isOwnerRole(user.role) || (storeId !== undefined && user.storeIds.includes(storeId));
  if (!allowed) {
    return <Navigate to={homePathForUser(user)} replace />;
  }

  return <Outlet />;
}

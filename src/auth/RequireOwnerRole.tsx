import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { isOwnerRole } from "@/data/types";
import { homePathForUser } from "@/auth/paths";

/** Protege /admin/*: solo dueño/administrador (ven todas las tiendas). */
export function RequireOwnerRole() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (!isOwnerRole(session.user.role)) {
    return <Navigate to={homePathForUser(session.user)} replace />;
  }
  return <Outlet />;
}

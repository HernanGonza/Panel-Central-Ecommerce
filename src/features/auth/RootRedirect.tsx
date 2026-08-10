import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { homePathForUser } from "@/auth/paths";

/** "/" vive dentro de <RequireAuth/>, así que acá siempre hay sesión. */
export function RootRedirect() {
  const { session } = useAuth();
  return <Navigate to={session ? homePathForUser(session.user) : "/login"} replace />;
}

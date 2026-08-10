import { isOwnerRole, type AppUser } from "@/data/types";

/** A dónde mandar a un usuario recién logueado, o cuando un guard le niega una ruta. */
export function homePathForUser(user: AppUser): string {
  if (isOwnerRole(user.role)) return "/admin/general";
  const storeId = user.storeIds[0];
  return storeId ? `/tienda/${storeId}/pedidos` : "/login";
}

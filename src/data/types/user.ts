export type Role = "dueño" | "administrador" | "gerente" | "vendedor";

export type UserStatus = "activo" | "invitado";

export interface AppUser {
  id: string;
  name: string;
  role: Role;
  /** Vacío para "dueño"/"administrador": ven todas las tiendas. */
  storeIds: string[];
  status: UserStatus;
}

export const ROLE_LABEL: Record<Role, string> = {
  dueño: "Dueño / Administrador",
  administrador: "Dueño / Administrador",
  gerente: "Gerente de tienda",
  vendedor: "Vendedor",
};

export function isOwnerRole(role: Role): boolean {
  return role === "dueño" || role === "administrador";
}

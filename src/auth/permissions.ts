import { isOwnerRole, type Role } from "@/data/types";

/** Dueño/administrador y gerente administran el catálogo; el vendedor solo lo consulta. */
export function canManageCatalog(role: Role): boolean {
  return isOwnerRole(role) || role === "gerente";
}

export function canViewStock(role: Role): boolean {
  return isOwnerRole(role) || role === "gerente";
}

export function canViewReports(role: Role): boolean {
  return isOwnerRole(role) || role === "gerente";
}

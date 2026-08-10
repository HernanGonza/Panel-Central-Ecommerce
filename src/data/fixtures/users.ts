import type { AppUser } from "@/data/types";

export const users: AppUser[] = [
  { id: "aperez", name: "Ana Pérez", role: "dueño", storeIds: [], status: "activo" },
  { id: "mdiaz", name: "Marcos Díaz", role: "gerente", storeIds: ["norte"], status: "activo" },
  { id: "jrohm", name: "Julieta Röhm", role: "vendedor", storeIds: ["centro"], status: "activo" },
  { id: "frios", name: "Facundo Ríos", role: "gerente", storeIds: ["sur"], status: "activo" },
  { id: "smolina", name: "Sofía Molina", role: "vendedor", storeIds: ["este"], status: "invitado" },
  { id: "nvera", name: "Nicolás Vera", role: "vendedor", storeIds: ["norte"], status: "activo" },
];

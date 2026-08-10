import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUsers } from "@/features/users/hooks";
import { useStores } from "@/features/stores/hooks";
import { ROLE_LABEL } from "@/data/types";
import { ROLE_TONE, USER_STATUS_TONE } from "@/lib/status-tones";

export function UsersPage() {
  const { data: users = [] } = useUsers();
  const { data: stores = [] } = useStores();

  const storeNames = (ids: string[]) =>
    ids.length === 0 ? "Todas las tiendas" : ids.map((id) => stores.find((s) => s.id === id)?.name ?? id).join(", ");

  return (
    <>
      <PageHeader title="Usuarios" subtitle="Roles y accesos por tienda" />

      <SectionCard title="Usuarios y accesos" subtitle="Roles definidos por tienda">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Tienda</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell>
                  <StatusPill label={ROLE_LABEL[user.role]} tone={ROLE_TONE[user.role]} />
                </TableCell>
                <TableCell className="text-muted-foreground">{storeNames(user.storeIds)}</TableCell>
                <TableCell className="text-right">
                  <StatusPill
                    label={user.status === "activo" ? "Activo" : "Invitado"}
                    tone={USER_STATUS_TONE[user.status]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </>
  );
}

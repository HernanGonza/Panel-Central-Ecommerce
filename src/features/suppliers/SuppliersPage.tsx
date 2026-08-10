import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSuppliers } from "@/features/suppliers/hooks";
import { SupplierDialog } from "@/features/suppliers/SupplierDialog";

export function SuppliersPage() {
  const { data: suppliers = [] } = useSuppliers();

  return (
    <>
      <PageHeader title="Proveedores" subtitle="Proveedores del catálogo" action={<SupplierDialog />} />

      <SectionCard title="Proveedores">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.contactPhone || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.contactEmail || "—"}</TableCell>
              </TableRow>
            ))}
            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                  Todavía no hay proveedores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>
    </>
  );
}

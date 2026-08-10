import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSuppliers } from "@/features/suppliers/hooks";
import { SupplierDialog } from "@/features/suppliers/SupplierDialog";
import { SupplierDetailDialog } from "@/features/suppliers/SupplierDetailDialog";
import type { Supplier } from "@/data/types";

export function SuppliersPage() {
  const { data: suppliers = [] } = useSuppliers();
  const [selected, setSelected] = useState<Supplier | null>(null);

  return (
    <>
      <PageHeader title="Proveedores" subtitle="Proveedores del catálogo de productos" action={<SupplierDialog />} />

      <SectionCard title="Proveedores" subtitle="Tocá uno para ver el detalle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} onClick={() => setSelected(supplier)} className="cursor-pointer">
                <TableCell className="font-medium text-foreground">{supplier.name}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.contactName || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.contactPhone || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.contactEmail || "—"}</TableCell>
              </TableRow>
            ))}
            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  Todavía no hay proveedores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>

      <SupplierDetailDialog supplier={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}

import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomers } from "@/features/customers/hooks";
import { CustomerDetailDialog } from "@/features/customers/CustomerDetailDialog";
import type { Customer } from "@/data/types";
import { formatCurrency, formatNumber, formatRelativeDate } from "@/lib/format";
import { downloadCsv } from "@/lib/csv";

export function CustomersView({ storeId }: { storeId?: string | undefined }) {
  const { data: customers = [] } = useCustomers({ storeId });
  const [selected, setSelected] = useState<Customer | null>(null);

  function handleExport() {
    downloadCsv(
      "clientes",
      [
        { label: "Cliente", key: "nombre" },
        { label: "Email", key: "email" },
        { label: "Teléfono", key: "telefono" },
        { label: "DNI/CUIT", key: "docId" },
        { label: "Dirección", key: "direccion" },
        { label: "Compras", key: "compras" },
        { label: "Gasto total", key: "gasto" },
        { label: "Última compra", key: "ultima" },
      ],
      customers.map((c) => ({
        nombre: c.name,
        email: c.email,
        telefono: c.phone,
        docId: c.docId,
        direccion: c.address ?? "",
        compras: c.purchasesCount,
        gasto: c.totalSpent,
        ultima: new Date(c.lastPurchaseAt).toLocaleDateString("es-AR"),
      })),
    );
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={storeId ? "Clientes de esta tienda" : "Base consolidada por email y DNI/CUIT"}
        action={
          <Button type="button" variant="outline" size="sm" onClick={handleExport}>
            <Download className="size-3.5" />
            Exportar CSV
          </Button>
        }
      />

      <SectionCard title="Clientes" subtitle="Tocá un cliente para ver la ficha completa">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Gasto total</TableHead>
                <TableHead className="text-right">Última compra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => setSelected(customer)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatNumber(customer.purchasesCount)}
                  </TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatRelativeDate(customer.lastPurchaseAt)}
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Todavía no hay clientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <CustomerDetailDialog
        customer={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}

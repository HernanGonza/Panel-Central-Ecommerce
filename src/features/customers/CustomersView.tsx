import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomers } from "@/features/customers/hooks";
import { useStores } from "@/features/stores/hooks";
import { formatCurrency, formatNumber, formatRelativeDate } from "@/lib/format";

export function CustomersView({ storeId }: { storeId?: string | undefined }) {
  const { data: customers = [] } = useCustomers({ storeId });
  const { data: stores = [] } = useStores();

  const storeNames = (ids: string[]) => ids.map((id) => stores.find((s) => s.id === id)?.name ?? id).join(", ");

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={storeId ? "Clientes de esta tienda" : "Base consolidada por email y DNI/CUIT"}
      />

      <SectionCard title="Clientes" subtitle={storeId ? undefined : "Base consolidada"}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>DNI/CUIT</TableHead>
                <TableHead>Tiendas</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Gasto total</TableHead>
                <TableHead className="text-right">Última compra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.docId}</TableCell>
                  <TableCell className="text-muted-foreground">{storeNames(customer.storeIds)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatNumber(customer.purchasesCount)}</TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatRelativeDate(customer.lastPurchaseAt)}
                  </TableCell>
                </TableRow>
              ))}
              {customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    Todavía no hay clientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </>
  );
}

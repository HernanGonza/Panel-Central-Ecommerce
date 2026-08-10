import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useShippingProviders } from "@/features/shipping/hooks";
import { ShippingProviderDialog } from "@/features/shipping/ShippingProviderDialog";
import { ShippingProviderDetailDialog } from "@/features/shipping/ShippingProviderDetailDialog";
import type { ShippingProvider } from "@/data/types";

export function ShippingProvidersPage() {
  const { data: providers = [] } = useShippingProviders();
  const [selected, setSelected] = useState<ShippingProvider | null>(null);

  return (
    <>
      <PageHeader
        title="Proveedores de envío"
        subtitle="Empresas de logística para envíos a domicilio"
        action={<ShippingProviderDialog />}
      />

      <SectionCard title="Proveedores de envío" subtitle="Tocá uno para ver el detalle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Cobertura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id} onClick={() => setSelected(provider)} className="cursor-pointer">
                <TableCell className="font-medium text-foreground">{provider.name}</TableCell>
                <TableCell className="text-muted-foreground">{provider.contactName || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{provider.coverageArea || "—"}</TableCell>
              </TableRow>
            ))}
            {providers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                  Todavía no hay proveedores de envío.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SectionCard>

      <ShippingProviderDetailDialog provider={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}

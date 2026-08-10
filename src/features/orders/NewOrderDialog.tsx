import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScannerDialog } from "@/components/shared/BarcodeScannerDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/features/products/hooks";
import { useCreateCustomer, useCustomers } from "@/features/customers/hooks";
import { useCreateOrder } from "@/features/orders/hooks";
import { useAuth } from "@/auth/useAuth";
import { ORDER_STATUS_LABEL, ORDER_STATUS_ORDER, type OrderItem, type OrderStatus } from "@/data/types";
import { formatCurrency } from "@/lib/format";

const NEW_CUSTOMER = "__new__";

interface LineItem {
  productId: string;
  quantity: number;
}

interface FormValues {
  customerId: string;
  newCustomerName: string;
  newCustomerPhone: string;
  newCustomerEmail: string;
  status: OrderStatus;
  lines: LineItem[];
}

const emptyDefaults: FormValues = {
  customerId: NEW_CUSTOMER,
  newCustomerName: "",
  newCustomerPhone: "",
  newCustomerEmail: "",
  status: "pendiente",
  lines: [{ productId: "", quantity: 1 }],
};

export function NewOrderDialog({ storeId }: { storeId: string }) {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const { data: products = [] } = useProducts({ storeId });
  const { data: customers = [] } = useCustomers({ storeId });
  const createOrder = useCreateOrder();
  const createCustomer = useCreateCustomer();

  const form = useForm<FormValues>({ defaultValues: emptyDefaults });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "lines" });

  const customerId = form.watch("customerId");
  const lines = form.watch("lines");
  const total = lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    return sum + (product ? product.price * (line.quantity || 0) : 0);
  }, 0);

  function handleScan(code: string) {
    const product = products.find((p) => p.barcode === code);
    if (!product) {
      toast.error("Ningún producto de esta tienda tiene ese código");
      return;
    }
    const existingIndex = lines.findIndex((l) => l.productId === product.id);
    if (existingIndex >= 0) {
      form.setValue(`lines.${existingIndex}.quantity`, (lines[existingIndex]?.quantity ?? 0) + 1);
    } else {
      const emptyIndex = lines.findIndex((l) => !l.productId);
      if (emptyIndex >= 0) form.setValue(`lines.${emptyIndex}.productId`, product.id);
      else append({ productId: product.id, quantity: 1 });
    }
    toast.success(`${product.name} agregado`);
  }

  async function onSubmit(values: FormValues) {
    const validLines = values.lines.filter((l) => l.productId && l.quantity > 0);
    if (validLines.length === 0) {
      toast.error("Agregá al menos un producto");
      return;
    }

    const isNewCustomer = values.customerId === NEW_CUSTOMER;
    if (isNewCustomer && !values.newCustomerName.trim()) {
      toast.error("Ingresá el nombre del cliente");
      return;
    }

    const items: OrderItem[] = validLines.map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return {
        productId: line.productId,
        productName: product?.name ?? line.productId,
        quantity: line.quantity,
        unitPrice: product?.price ?? 0,
      };
    });
    const orderTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    let resolvedCustomerId = values.customerId;
    let customerName: string;

    if (isNewCustomer) {
      const newCustomer = await createCustomer.mutateAsync({
        name: values.newCustomerName.trim(),
        email: values.newCustomerEmail.trim(),
        phone: values.newCustomerPhone.trim(),
        docId: "",
        storeIds: [storeId],
        purchasesCount: 1,
        totalSpent: orderTotal,
        lastPurchaseAt: new Date().toISOString(),
      });
      resolvedCustomerId = newCustomer.id;
      customerName = newCustomer.name;
    } else {
      customerName = customers.find((c) => c.id === values.customerId)?.name ?? "Cliente";
    }

    await createOrder.mutateAsync({
      storeId,
      customerId: resolvedCustomerId,
      customerName,
      status: values.status,
      items,
      total: orderTotal,
      sellerId: session?.user.id,
    });

    toast.success(`Venta cargada para ${customerName}`);
    form.reset(emptyDefaults);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Nueva venta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva venta</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Select value={customerId} onValueChange={(v) => form.setValue("customerId", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NEW_CUSTOMER}>Cliente nuevo / ocasional</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {customerId === NEW_CUSTOMER && (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Input placeholder="Nombre" {...form.register("newCustomerName")} />
                <Input placeholder="Teléfono" {...form.register("newCustomerPhone")} />
                <Input placeholder="Email" type="email" {...form.register("newCustomerEmail")} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Productos</Label>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const line = lines[index];
                const product = products.find((p) => p.id === line?.productId);
                return (
                  <div key={field.id} className="flex items-center gap-2">
                    <Select
                      value={line?.productId ?? ""}
                      onValueChange={(v) => form.setValue(`lines.${index}.productId`, v)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Elegir producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} · {formatCurrency(p.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      className="w-20"
                      value={line?.quantity ?? 1}
                      onChange={(e) => form.setValue(`lines.${index}.quantity`, e.target.valueAsNumber || 1)}
                    />
                    <span className="w-24 shrink-0 text-right text-sm text-muted-foreground">
                      {product ? formatCurrency(product.price * (line?.quantity ?? 0)) : "—"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1 })}>
              <Plus className="size-3.5" />
              Agregar producto
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label>Estado inicial</Label>
            <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as OrderStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="font-display text-lg font-semibold text-foreground">{formatCurrency(total)}</span>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createOrder.isPending || createCustomer.isPending}>
              Registrar venta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

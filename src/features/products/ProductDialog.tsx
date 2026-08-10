import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProduct, useUpdateProduct } from "@/features/products/hooks";
import { useStores } from "@/features/stores/hooks";
import { PRODUCT_CATEGORIES, PRODUCT_SUPPLIERS } from "@/data/fixtures/products";
import type { Product } from "@/data/types";

const schema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  category: z.string().min(1, "Elegí una categoría"),
  storeId: z.string().min(1, "Elegí una tienda"),
  supplier: z.string().min(1, "Elegí un proveedor"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  cost: z.number().nonnegative("El costo no puede ser negativo"),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
});

type FormValues = z.infer<typeof schema>;

function NumberField({
  value,
  onChange,
  onBlur,
  name,
  step = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
  name: string;
  step?: number;
}) {
  return (
    <Input
      type="number"
      min={0}
      step={step}
      name={name}
      value={Number.isNaN(value) ? "" : value}
      onChange={(e) => onChange(e.target.valueAsNumber)}
      onBlur={onBlur}
    />
  );
}

export function ProductDialog({ product, storeId }: { product?: Product; storeId?: string | undefined }) {
  const [open, setOpen] = useState(false);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: stores = [] } = useStores();
  const isEdit = product !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          storeId: product.storeId,
          supplier: product.supplier,
          price: product.price,
          cost: product.cost,
          stock: product.stock,
        }
      : {
          name: "",
          category: "",
          storeId: storeId ?? "",
          supplier: "",
          price: 0,
          cost: 0,
          stock: 0,
        },
  });

  async function onSubmit(values: FormValues) {
    if (isEdit) {
      await updateProduct.mutateAsync({ id: product.id, patch: values });
      toast.success(`${values.name} se actualizó`);
    } else {
      await createProduct.mutateAsync(values);
      toast.success(`${values.name} se agregó al catálogo`);
      form.reset({ name: "", category: "", storeId: storeId ?? "", supplier: "", price: 0, cost: 0, stock: 0 });
    }
    setOpen(false);
  }

  const trigger: ReactNode = isEdit ? (
    <Button variant="ghost" size="icon" className="size-8">
      <Pencil className="size-3.5" />
      <span className="sr-only">Editar {product.name}</span>
    </Button>
  ) : (
    <Button size="sm">
      <Plus className="size-4" />
      Nuevo producto
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Remera básica algodón" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Elegir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tienda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!!storeId || isEdit}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Elegir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stores.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Elegir" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_SUPPLIERS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo</FormLabel>
                    <FormControl>
                      <NumberField {...field} step={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <NumberField {...field} step={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <NumberField {...field} step={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {isEdit ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

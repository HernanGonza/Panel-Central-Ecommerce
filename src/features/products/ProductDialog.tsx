import { useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ImagePlus, Pencil, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductThumbnail } from "@/components/shared/ProductThumbnail";
import { Barcode } from "@/components/shared/Barcode";
import {
  useCategories,
  useCreateCategory,
  useCreateProduct,
  useUpdateProduct,
} from "@/features/products/hooks";
import { useCreateSupplier, useSuppliers } from "@/features/suppliers/hooks";
import { useStores } from "@/features/stores/hooks";
import { generateBarcode } from "@/lib/barcode";
import type { Product } from "@/data/types";

const NEW_OPTION = "__new__";

const schema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  category: z.string().min(1, "Elegí una categoría"),
  newCategoryName: z.string(),
  storeId: z.string().min(1, "Elegí una tienda"),
  supplier: z.string().min(1, "Elegí un proveedor"),
  newSupplierName: z.string(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  cost: z.number().nonnegative("El costo no puede ser negativo"),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  imageUrl: z.string(),
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

export function ProductDialog({
  product,
  storeId,
}: {
  product?: Product;
  storeId?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [barcode, setBarcode] = useState(() => product?.barcode ?? generateBarcode());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: stores = [] } = useStores();
  const { data: categories = [] } = useCategories();
  const { data: suppliers = [] } = useSuppliers();
  const createCategory = useCreateCategory();
  const createSupplier = useCreateSupplier();
  const isEdit = product !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          newCategoryName: "",
          storeId: product.storeId,
          supplier: product.supplier,
          newSupplierName: "",
          price: product.price,
          cost: product.cost,
          stock: product.stock,
          imageUrl: product.imageUrl ?? "",
        }
      : {
          name: "",
          category: "",
          newCategoryName: "",
          storeId: storeId ?? "",
          supplier: "",
          newSupplierName: "",
          price: 0,
          cost: 0,
          stock: 0,
          imageUrl: "",
        },
  });

  const imageUrl = form.watch("imageUrl");
  const nameForPreview = form.watch("name") || "Producto";

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => form.setValue("imageUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: FormValues) {
    let category = values.category;
    if (category === NEW_OPTION) {
      const name = values.newCategoryName.trim();
      if (!name) {
        form.setError("newCategoryName", { message: "Ingresá el nombre de la categoría" });
        return;
      }
      category = await createCategory.mutateAsync(name);
    }

    let supplier = values.supplier;
    if (supplier === NEW_OPTION) {
      const name = values.newSupplierName.trim();
      if (!name) {
        form.setError("newSupplierName", { message: "Ingresá el nombre del proveedor" });
        return;
      }
      const created = await createSupplier.mutateAsync({ name });
      supplier = created.name;
    }

    const patch = {
      name: values.name,
      category,
      storeId: values.storeId,
      supplier,
      price: values.price,
      cost: values.cost,
      stock: values.stock,
      imageUrl: values.imageUrl || undefined,
    };

    if (isEdit) {
      await updateProduct.mutateAsync({ id: product.id, patch });
      toast.success(`${values.name} se actualizó`);
    } else {
      await createProduct.mutateAsync({ ...patch, unitsSold: 0, barcode });
      toast.success(`${values.name} se agregó al catálogo`);
      const nextBarcode = generateBarcode();
      setBarcode(nextBarcode);
      form.reset({
        name: "",
        category: "",
        newCategoryName: "",
        storeId: storeId ?? "",
        supplier: "",
        newSupplierName: "",
        price: 0,
        cost: 0,
        stock: 0,
        imageUrl: "",
      });
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-3">
              <ProductThumbnail
                name={nameForPreview}
                imageUrl={imageUrl || undefined}
                className="size-14"
              />
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="size-3.5" />
                  {imageUrl ? "Cambiar imagen" : "Subir imagen"}
                </Button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => form.setValue("imageUrl", "")}
                    className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

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
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                        <SelectItem value={NEW_OPTION}>+ Nueva categoría</SelectItem>
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
            {form.watch("category") === NEW_OPTION && (
              <FormField
                control={form.control}
                name="newCategoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Accesorios de invierno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                      <SelectItem value={NEW_OPTION}>+ Nuevo proveedor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("supplier") === NEW_OPTION && (
              <FormField
                control={form.control}
                name="newSupplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del proveedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nuevo proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Código de barras</span>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setBarcode(generateBarcode())}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="size-3" />
                    Regenerar
                  </button>
                )}
              </div>
              <div className="rounded-lg border border-border bg-card p-2">
                <Barcode value={isEdit ? product.barcode : barcode} />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  createProduct.isPending ||
                  updateProduct.isPending ||
                  createCategory.isPending ||
                  createSupplier.isPending
                }
              >
                {isEdit ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

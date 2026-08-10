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
import { useCreatePromotion, useUpdatePromotion } from "@/features/promotions/hooks";
import { DISCOUNT_TYPE_LABEL, type Promotion } from "@/data/types";

const schema = z.object({
  title: z.string().min(2, "Ingresá un título"),
  description: z.string().min(1, "Ingresá una descripción"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive("El descuento debe ser mayor a 0"),
  startDate: z.string(),
  endDate: z.string(),
});

type FormValues = z.infer<typeof schema>;

function toDateInput(iso: string | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

export function PromotionDialog({ storeId, promotion }: { storeId: string; promotion?: Promotion }) {
  const [open, setOpen] = useState(false);
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const isEdit = promotion !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: promotion
      ? {
          title: promotion.title,
          description: promotion.description,
          discountType: promotion.discountType,
          discountValue: promotion.discountValue,
          startDate: toDateInput(promotion.startDate),
          endDate: toDateInput(promotion.endDate),
        }
      : {
          title: "",
          description: "",
          discountType: "percentage",
          discountValue: 10,
          startDate: "",
          endDate: "",
        },
  });

  async function onSubmit(values: FormValues) {
    const patch = {
      title: values.title,
      description: values.description,
      discountType: values.discountType,
      discountValue: values.discountValue,
      startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
      endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
    };

    if (isEdit) {
      await updatePromotion.mutateAsync({ id: promotion.id, patch });
      toast.success(`${values.title} se actualizó`);
    } else {
      await createPromotion.mutateAsync({ ...patch, storeId, active: true });
      toast.success(`${values.title} se creó`);
      form.reset({ title: "", description: "", discountType: "percentage", discountValue: 10, startDate: "", endDate: "" });
    }
    setOpen(false);
  }

  const trigger: ReactNode = isEdit ? (
    <Button variant="ghost" size="icon" className="size-8">
      <Pencil className="size-3.5" />
      <span className="sr-only">Editar {promotion.title}</span>
    </Button>
  ) : (
    <Button size="sm">
      <Plus className="size-4" />
      Nueva promoción
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar promoción" : "Nueva promoción"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Campaña de invierno" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="20% off en toda la línea de abrigo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(DISCOUNT_TYPE_LABEL).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={Number.isNaN(field.value) ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desde (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasta (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Sin fechas, la promoción se prende y apaga solo manualmente desde la tarjeta.
            </p>
            <DialogFooter>
              <Button type="submit" disabled={createPromotion.isPending || updatePromotion.isPending}>
                {isEdit ? "Guardar cambios" : "Crear promoción"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";
import type { Promotion } from "@/data/types";

export function usePromotions(filter?: StoreScoped) {
  return useQuery({
    queryKey: ["promotions", filter ?? {}],
    queryFn: () => repositories.promotions.list(filter),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Promotion, "id">) => repositories.promotions.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<Promotion, "id">> }) =>
      repositories.promotions.update(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}

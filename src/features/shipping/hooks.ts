import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { ShippingProvider } from "@/data/types";

export function useShippingProviders() {
  return useQuery({
    queryKey: ["shipping-providers"],
    queryFn: () => repositories.shippingProviders.list(),
  });
}

export function useCreateShippingProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<ShippingProvider, "id">) =>
      repositories.shippingProviders.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shipping-providers"] });
    },
  });
}

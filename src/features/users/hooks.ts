import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";
import type { StoreScoped } from "@/data/repositories/interfaces";

export function useUsers(filter?: StoreScoped) {
  return useQuery({
    queryKey: ["users", filter ?? {}],
    queryFn: () => repositories.users.list(filter),
  });
}

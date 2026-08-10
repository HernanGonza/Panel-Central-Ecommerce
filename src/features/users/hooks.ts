import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/data/repositories";

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: () => repositories.users.list() });
}

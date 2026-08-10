import type { UserRepository } from "@/data/repositories/interfaces";
import { users } from "@/data/fixtures/users";
import { delay } from "@/data/repositories/memory/delay";

export const memoryUserRepository: UserRepository = {
  async list(filter) {
    const storeId = filter?.storeId;
    const result = storeId
      ? users.filter((u) => u.storeIds.length === 0 || u.storeIds.includes(storeId))
      : users;
    return delay([...result]);
  },
  async getById(id) {
    return delay(users.find((u) => u.id === id));
  },
};

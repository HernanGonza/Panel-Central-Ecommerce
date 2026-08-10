import type { CategoryRepository } from "@/data/repositories/interfaces";
import { INITIAL_PRODUCT_CATEGORIES } from "@/data/fixtures/products";
import { delay } from "@/data/repositories/memory/delay";

const categories: string[] = [...INITIAL_PRODUCT_CATEGORIES];

export const memoryCategoryRepository: CategoryRepository = {
  async list() {
    return delay([...categories]);
  },
  async create(name) {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) categories.push(trimmed);
    return delay(trimmed);
  },
};

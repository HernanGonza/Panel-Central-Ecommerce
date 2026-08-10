import type { PromotionRepository } from "@/data/repositories/interfaces";
import { promotions as promotionFixtures } from "@/data/fixtures/promotions";
import type { Promotion } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const promotions: Promotion[] = [...promotionFixtures];
let nextId = promotions.length + 1;

export const memoryPromotionRepository: PromotionRepository = {
  async list(filter) {
    const result = filter?.storeId ? promotions.filter((p) => p.storeId === filter.storeId) : promotions;
    return delay([...result]);
  },
  async create(input) {
    const promotion: Promotion = { ...input, id: `promo-${nextId++}` };
    promotions.push(promotion);
    return delay(promotion);
  },
  async update(id, patch) {
    const index = promotions.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Promoción ${id} no encontrada`);
    const current = promotions[index];
    if (!current) throw new Error(`Promoción ${id} no encontrada`);
    const updated: Promotion = { ...current, ...patch };
    promotions[index] = updated;
    return delay(updated);
  },
};

import type { ShippingProviderRepository } from "@/data/repositories/interfaces";
import { shippingProviders as shippingProviderFixtures } from "@/data/fixtures/shipping-providers";
import type { ShippingProvider } from "@/data/types";
import { delay } from "@/data/repositories/memory/delay";

const shippingProviders: ShippingProvider[] = [...shippingProviderFixtures];
let nextId = shippingProviders.length + 1;

export const memoryShippingProviderRepository: ShippingProviderRepository = {
  async list() {
    return delay([...shippingProviders]);
  },
  async create(input) {
    const provider: ShippingProvider = { ...input, id: `ship-${nextId++}` };
    shippingProviders.push(provider);
    return delay(provider);
  },
};

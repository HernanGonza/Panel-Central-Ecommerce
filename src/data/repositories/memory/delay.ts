/** Simula latencia de red para que la UI (loading/skeletons) se comporte como con un backend real. */
export function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

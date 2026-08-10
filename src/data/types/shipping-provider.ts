export interface ShippingProvider {
  id: string;
  name: string;
  contactName?: string | undefined;
  contactPhone?: string | undefined;
  contactEmail?: string | undefined;
  /** Zonas o modalidad que cubre (ej. "CABA y GBA, 24-48hs"). */
  coverageArea?: string | undefined;
}

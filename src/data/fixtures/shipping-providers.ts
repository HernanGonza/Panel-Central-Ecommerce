import type { ShippingProvider } from "@/data/types";

export const shippingProviders: ShippingProvider[] = [
  {
    id: "ship-1",
    name: "Correo Argentino",
    contactName: "Mesa de ayuda comercial",
    contactPhone: "0810-777-7787",
    contactEmail: "comercial@correoargentino.com.ar",
    coverageArea: "Todo el país, 3-7 días hábiles",
  },
  {
    id: "ship-2",
    name: "Andreani",
    contactName: "Federico Lamas",
    contactPhone: "0810-122-1200",
    contactEmail: "pymes@andreani.com",
    coverageArea: "Todo el país, 24-72hs en AMBA",
  },
  {
    id: "ship-3",
    name: "OCA",
    contactName: "Rocío Peralta",
    contactPhone: "0810-122-4622",
    contactEmail: "contacto@oca.com.ar",
    coverageArea: "CABA y GBA, entrega en el día",
  },
];

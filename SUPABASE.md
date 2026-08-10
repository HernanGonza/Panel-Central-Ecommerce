# Plan de integración con Supabase

Este documento describe cómo se va a mapear el modelo actual (mock en memoria,
`src/data/`) a Supabase cuando el cliente defina cuenta y credenciales. No es
código — es la guía para cuando se implemente `src/data/repositories/supabase/*`.

## Por qué schema-por-tienda

Cada tienda gestiona su propio stock y operación de forma aislada — ese es el
requisito de negocio (`"hay separación entre stocks"`). En Postgres esto se
resuelve con **un schema por tienda** (`store_norte`, `store_centro`, ...),
cada uno con sus propias tablas `products`, `orders`, `order_items`,
`promotions`, `invoices`. Los permisos de Postgres (RLS + grants por schema)
son los que garantizan que un gerente/vendedor de "Norte" no pueda leer ni
escribir en el schema de "Sur", sin tener que filtrar por `store_id` a mano en
cada query.

Los schemas de Postgres pueden referenciarse entre sí dentro de la misma base
(FKs cross-schema funcionan bien), así que las entidades que necesitan estar
consolidadas — clientes, usuarios, proveedores — viven en un schema
compartido (`public`) y cada schema de tienda las referencia por id.

## Dónde vive cada entidad

**`public` (compartido, una sola fuente de verdad):**

- `stores` — registro de tiendas (id, nombre, zona, estado). Es la tabla que
  le dice a la app qué schemas existen.
- `users` — identidad + rol (`dueño`/`administrador`/`gerente`/`vendedor`) +
  a qué tienda(s) tiene acceso. Supabase Auth vive acá.
- `customers` — la base se consolida por email y DNI/CUIT
  (`storeIds: string[]` ya modela que un cliente puede comprar en más de una
  tienda — por eso NO puede vivir dentro de un schema de tienda).
- `suppliers` — proveedores de productos (no son por tienda).
- `shipping_providers` — proveedores de envío/logística (tampoco son por
  tienda).
- `categories` — taxonomía de categorías de producto, compartida.

**`store_<slug>` (uno por tienda, mismo set de tablas repetido):**

- `products` — acá vive el stock. Esto es lo que da la separación real.
- `orders` + `order_items` — pedidos de esa tienda; `order_items` reemplaza
  el array `items` embebido que hoy usamos en el mock.
- `promotions` — confirmado explícitamente como por-tienda, no global.
- `invoices` — facturación de esa tienda.

## El único punto de cambio: `src/data/repositories/index.ts`

Todo el resto de la app (hooks de `features/*`, `auth/*`) llama a
`repositories.<entidad>.<método>()` — nunca a una implementación concreta.
Migrar a Supabase es:

1. Crear `src/data/repositories/supabase/supabase-*-repository.ts` implementando
   las mismas interfaces de `src/data/repositories/interfaces.ts`.
2. Para las entidades por-tienda, el repositorio Supabase resuelve el schema a
   partir de `filter.storeId` (o del `storeId` que ya reciben `create`/`update`),
   ej. `supabase.schema(\`store_${storeId}\`).from("products")...`.
3. Reemplazar los `memory*Repository` por los `supabase*Repository` en
   `repositories/index.ts`. Nada en `features/*` cambia.

## Vistas "todas las tiendas" (admin)

Panel general, Productos/Stock/Pedidos/Reportes sin filtro de tienda hoy
recorren el array en memoria completo. Con schema-por-tienda, esas vistas
tienen que salir a buscar a N schemas (uno por tienda) y mezclar en la capa de
aplicación — no hay una sola tabla que las contenga a todas. Con la cantidad
de tiendas de un comercio real (decenas, no miles) esto es perfectamente
viable como `Promise.all` de una query por schema. Alternativa más prolija a
futuro: una función de Postgres que haga `UNION ALL` sobre los schemas
conocidos, o una tabla resumen (`store_stats`) actualizada por trigger/cron —
no es necesario para el MVP.

## Campos derivados que hoy son estáticos

`Store.monthlySales` / `stockUnits` / `ordersCount` hoy son campos fijos en el
fixture. En Supabase deberían calcularse (agregando sobre el schema de esa
tienda) en vez de guardarse — o mantenerse en una tabla resumen si el cálculo
en vivo resulta caro.

## Auth

El login mock (`src/auth/memory-auth-service.ts`) se reemplaza por Supabase
Auth. La interfaz `AuthService` (`src/auth/types.ts`) ya está pensada para
eso — `login`/`logout`/`getSession` mapean 1:1 a los métodos de
`supabase.auth`. El rol y las tiendas del usuario logueado salen de la fila
correspondiente en `public.users`, no del JWT directamente.

## Pagos (pendiente de definir pasarela)

Hoy cada venta cargada desde "Nueva venta" genera un `Invoice` en el momento
(`InvoiceRepository.create`, ver `NewOrderDialog.tsx`), con el medio de pago y
el estado (pagado/pendiente) elegidos a mano por quien vende — porque todavía
no hay pasarela conectada. `Invoice.orderId` ya vincula cada comprobante con
su pedido.

Cuando se conecte una pasarela real (Mercado Pago, Stripe, etc.):

- El flujo pasa a ser: crear el pedido → crear el `Invoice` en estado
  `pendiente` → redirigir/mostrar el checkout de la pasarela → un webhook de
  la pasarela actualiza `Invoice.status` a `pagado` (o lo deja `pendiente` si
  falla). El campo `paid` que hoy carga la persona a mano en el formulario
  desaparece del form y pasa a ser responsabilidad del webhook.
- El webhook necesita un endpoint — con Supabase, una Edge Function que reciba
  la notificación de la pasarela, valide la firma, y haga el `update` del
  `Invoice` correspondiente (matcheado por un `externalPaymentId` que habría
  que agregar a la tabla).
- Para venta en el local (efectivo/tarjeta física) el flujo actual —elegir
  medio de pago y marcar pagado en el momento— sigue siendo válido tal cual;
  la pasarela solo entra en juego para pagos que se procesan online (tienda
  online futura, o un link de pago).

import { Navigate, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { RequireAuth } from "@/auth/RequireAuth";
import { RequireOwnerRole } from "@/auth/RequireOwnerRole";
import { RequireStoreAccess } from "@/auth/RequireStoreAccess";
import { RequireStorePermission } from "@/auth/RequireStorePermission";
import { canViewReports, canViewStock } from "@/auth/permissions";
import { LoginPage } from "@/features/auth/LoginPage";
import { RootRedirect } from "@/features/auth/RootRedirect";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StoreLayout } from "@/layouts/StoreLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { StoresPage } from "@/features/stores/StoresPage";
import { ProductsPage } from "@/features/products/ProductsPage";
import { CatalogPage } from "@/features/products/CatalogPage";
import { StockPage } from "@/features/stock/StockPage";
import { StoreStockPage } from "@/features/stock/StoreStockPage";
import { OrdersPage } from "@/features/orders/OrdersPage";
import { StoreOrdersPage } from "@/features/orders/StoreOrdersPage";
import { CustomersPage } from "@/features/customers/CustomersPage";
import { StoreCustomersPage } from "@/features/customers/StoreCustomersPage";
import { BillingPage } from "@/features/billing/BillingPage";
import { ReportsPage } from "@/features/reports/ReportsPage";
import { StoreReportsPage } from "@/features/reports/StoreReportsPage";
import { UsersPage } from "@/features/users/UsersPage";
import { SuppliersPage } from "@/features/suppliers/SuppliersPage";
import { PromotionsPage } from "@/features/promotions/PromotionsPage";
import { NotFoundPage } from "@/features/misc/NotFoundPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/admin" element={<RequireOwnerRole />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<DashboardPage />} />
            <Route path="tiendas" element={<StoresPage />} />
            <Route path="productos" element={<ProductsPage />} />
            <Route path="proveedores" element={<SuppliersPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="clientes" element={<CustomersPage />} />
            <Route path="facturacion" element={<BillingPage />} />
            <Route path="reportes" element={<ReportsPage />} />
            <Route path="usuarios" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="/tienda/:storeId" element={<RequireStoreAccess />}>
          <Route element={<StoreLayout />}>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<StoreOrdersPage />} />
            <Route path="catalogo" element={<CatalogPage />} />
            <Route path="promociones" element={<PromotionsPage />} />
            <Route path="clientes" element={<StoreCustomersPage />} />
            <Route element={<RequireStorePermission check={canViewStock} />}>
              <Route path="stock" element={<StoreStockPage />} />
            </Route>
            <Route element={<RequireStorePermission check={canViewReports} />}>
              <Route path="reportes" element={<StoreReportsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);

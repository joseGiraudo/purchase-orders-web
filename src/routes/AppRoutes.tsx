// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { ProductsPage } from '../pages/ProductsPage';
import { UsersPage } from '../pages/UsersPage';
import { PurchaseOrdersPage } from '../pages/purchase-orders/PurchaseOrdersPage';
import { CreatePurchaseOrderPage } from '../pages/purchase-orders/CreatePurchaseOrderPage';
import { PurchaseOrderDetailPage } from '../pages/purchase-orders/PurchaseOrderDetailPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <SuppliersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/purchase-orders/new" element={<CreatePurchaseOrderPage />} />
        <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
      </Route>
    </Routes>
  );
}
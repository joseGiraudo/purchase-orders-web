# CLAUDE.md — purchase-orders-web

Contexto del proyecto para Claude Code. Leer antes de generar o modificar código.

## Qué es este proyecto

Frontend de un sistema interno de **gestión de órdenes de compra** (Purchase Orders). Consume la API de `purchase-orders-api` (repo hermano). Empleados crean órdenes, supervisores las aprueban o rechazan, y las órdenes aprobadas siguen un flujo hasta la entrega.

## Stack

- React + TypeScript + Vite
- Axios para las peticiones HTTP
- TanStack Query para el manejo de estado del servidor (cache, loading, mutations)
- React Router para el ruteo
- Tailwind CSS para estilos
- Formularios con `useState` a mano (sin librería de formularios, el alcance no lo justifica)

## Convenciones

- **Todo en inglés**: nombres de archivos, componentes, variables, funciones, branches, mensajes de commit. La conversación conmigo puede ser en español, pero el código y el repo van en inglés.
- Componentes funcionales con hooks, nunca clases.
- Un componente por archivo, nombre de archivo = nombre del componente (`SupplierList.tsx`, no `supplier-list.tsx`).
- Commits en formato convencional: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`.
- Una rama por feature: `feature/nombre-corto`, mergeada a `main` vía PR.

## Estructura de carpetas

```
src/
  api/               → funciones puras que hacen las peticiones con Axios (sin React adentro)
    client.ts        → instancia de Axios con baseURL + interceptor de token
    suppliers.ts
    products.ts
    users.ts
    purchaseOrders.ts
    auth.ts

  hooks/             → hooks de TanStack Query que envuelven las funciones de api/
    useSuppliers.ts
    useProducts.ts
    useUsers.ts
    usePurchaseOrders.ts

  types/             → interfaces TypeScript que reflejan los DTOs del backend
    supplier.ts
    product.ts
    user.ts
    purchaseOrder.ts

  context/
    AuthContext.tsx  → usuario logueado, token, rol, funciones login/logout

  components/
    layout/          → Navbar, Sidebar, PageContainer
    ui/              → piezas reutilizables chicas (botones, inputs, tabla genérica)

  pages/
    LoginPage.tsx
    DashboardPage.tsx
    suppliers/
    products/
    users/
    purchase-orders/

  routes/
    AppRoutes.tsx
    ProtectedRoute.tsx  → verifica auth + rol antes de renderizar
```

## Backend de referencia

La API expone estos recursos (ver `CLAUDE.md` de `purchase-orders-api` para el detalle completo de DTOs):

- `GET/POST/PUT/DELETE /api/suppliers`
- `GET/POST/PUT/DELETE /api/products`
- `GET/POST/PUT/DELETE /api/users`
- `GET/POST /api/purchaseorders`, `PATCH /api/purchaseorders/{id}/status`
- `POST /api/auth/login`

Roles: `Employee`, `Supervisor`, `Admin`. El JWT trae el rol en un claim — usarlo para mostrar/ocultar navegación y proteger rutas con `ProtectedRoute`.

Estados de una orden (`OrderStatus`): `Created → Approved → Sent → Delivered`, con salidas a `Rejected` (solo desde `Created`) y `Cancelled` (desde `Created` o `Approved`, no desde `Sent` ni estados terminales).

## Query keys de TanStack Query — mantener esta convención

- `['suppliers']` / `['suppliers', id]`
- `['products']` / `['products', { supplierId }]`
- `['users']` / `['users', id]`
- `['purchase-orders']` / `['purchase-orders', id]`

## Cómo trabajar conmigo en este repo

- Avanzá de a una pantalla o feature chica por vez, no generes toda la app de una.
- Después de generar código, corré `npm run build` para validar que no haya errores de TypeScript antes de decir que está listo.
- No asumas decisiones de UI o de flujo que no estén en este archivo — si hace falta una, preguntame primero.
- Los DTOs del backend son la fuente de verdad para los tipos de `types/` — si hay dudas sobre la forma exacta de un DTO, preguntame en vez de inventar campos.

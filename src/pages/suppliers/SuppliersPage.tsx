// src/pages/suppliers/SuppliersPage.tsx
import { useSuppliers } from '../../hooks/useSuppliers';

export function SuppliersPage() {
  const { data: suppliers, isLoading, error } = useSuppliers();

  if (isLoading) return <p className="p-8">Cargando...</p>;
  if (error) return <p className="p-8 text-red-600">Error al cargar proveedores.</p>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-xl font-bold">Proveedores</h1>
      <ul className="space-y-2">
        {suppliers?.map((s) => (
          <li key={s.id} className="rounded border p-3">
            {s.name} — {s.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
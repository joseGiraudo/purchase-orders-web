// src/pages/products/ProductsPage.tsx
import { useState } from 'react';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { Modal } from '../components/ui/Modal';
import type { Product, CreateProductDto } from '../types/product';

const emptyForm: CreateProductDto = {
  supplierId: 0,
  name: '',
  description: '',
  sku: '',
  referencePrice: 0,
};

export function ProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  const { data: suppliers } = useSuppliers();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<CreateProductDto>(emptyForm);

  function openCreateModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      supplierId: product.supplierId,
      name: product.name,
      description: product.description ?? '',
      sku: product.sku ?? '',
      referencePrice: product.referencePrice,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingProduct) {
        // armo el dto para mandar al back
      const updateDto = {
        name: form.name,
        description: form.description,
        sku: form.sku,
        referencePrice: form.referencePrice,
       };
      await updateMutation.mutateAsync({ id: editingProduct.id, dto: updateDto });
    } else {
      await createMutation.mutateAsync(form);
    }

    closeModal();
  }

  async function handleDeactivate(id: number) {
    if (!confirm('¿Desactivar este producto?')) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-red-600">Error al cargar productos.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={openCreateModal}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo producto
        </button>
      </div>

      <table className="w-full rounded-lg bg-white shadow">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="p-3">Nombre</th>
            <th className="p-3">Proveedor</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Precio de referencia</th>
            <th className="p-3">Estado</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id} className="border-b text-sm">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.supplierName}</td>
              <td className="p-3">{p.sku || '—'}</td>
              <td className="p-3">${p.referencePrice.toFixed(2)}</td>
              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    p.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {p.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="space-x-2 p-3 text-right">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                {p.isActive && (
                  <button
                    onClick={() => handleDeactivate(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Desactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Editar producto' : 'Nuevo producto'}
      >
        <form onSubmit={handleSubmit}>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <select
            value={form.supplierId}
            onChange={(e) =>
              setForm({ ...form, supplierId: Number(e.target.value) })
            }
            disabled={!!editingProduct}
            className="mb-3 w-full rounded border border-gray-300 p-2 disabled:bg-gray-100"
            required
          >
            <option value={0} disabled>
              Seleccioná un proveedor
            </option>
            {suppliers
              ?.filter((s) => s.isActive)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
          {editingProduct && (
            <p className="-mt-2 mb-3 text-xs text-gray-500">
              El proveedor no se puede modificar una vez creado el producto.
            </p>
          )}

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mb-3 w-full rounded border border-gray-300 p-2"
            required
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mb-3 w-full rounded border border-gray-300 p-2"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            SKU
          </label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="mb-3 w-full rounded border border-gray-300 p-2"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Precio de referencia
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.referencePrice}
            onChange={(e) =>
              setForm({ ...form, referencePrice: Number(e.target.value) })
            }
            className="mb-4 w-full rounded border border-gray-300 p-2"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
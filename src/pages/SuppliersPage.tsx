import { useState } from 'react';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '../hooks/useSuppliers';
import { Modal } from '../components/ui/Modal';
import type { Supplier, CreateSupplierDto } from '../types/supplier';

const emptyForm: CreateSupplierDto = {
  name: '',
  taxId: '',
  contactName: '',
  email: '',
};

export function SuppliersPage() {
  const { data: suppliers, isLoading, error } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState<CreateSupplierDto>(emptyForm);

  function openCreateModal() {
    setEditingSupplier(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(supplier: Supplier) {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      taxId: supplier.taxId,
      contactName: supplier.contactName,
      email: supplier.email,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingSupplier) {
      await updateMutation.mutateAsync({ id: editingSupplier.id, dto: form });
    } else {
      await createMutation.mutateAsync(form);
    }

    closeModal();
  }

  async function handleDeactivate(id: number) {
    if (!confirm('¿Desactivar este proveedor?')) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Cargando proveedores...</p>;
  if (error) return <p className="text-red-600">Error al cargar proveedores.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Proveedores</h1>
        <button
          onClick={openCreateModal}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo proveedor
        </button>
      </div>

      <table className="w-full rounded-lg bg-white shadow">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="p-3">Nombre</th>
            <th className="p-3">CUIT</th>
            <th className="p-3">Contacto</th>
            <th className="p-3">Email</th>
            <th className="p-3">Estado</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {suppliers?.map((s) => (
            <tr key={s.id} className="border-b text-sm">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.taxId}</td>
              <td className="p-3">{s.contactName}</td>
              <td className="p-3">{s.email}</td>
              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    s.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="space-x-2 p-3 text-right">
                <button
                  onClick={() => openEditModal(s)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                {s.isActive && (
                  <button
                    onClick={() => handleDeactivate(s.id)}
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
        title={editingSupplier ? 'Editar proveedor' : 'Nuevo proveedor'}
      >
        <form onSubmit={handleSubmit}>
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
            CUIT
          </label>
          <input
            type="text"
            value={form.taxId}
            onChange={(e) => setForm({ ...form, taxId: e.target.value })}
            className="mb-3 w-full rounded border border-gray-300 p-2"
            required
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Contacto
          </label>
          <input
            type="text"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className="mb-3 w-full rounded border border-gray-300 p-2"
            required
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
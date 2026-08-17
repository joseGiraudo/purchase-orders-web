// src/pages/users/UsersPage.tsx
import { useState } from 'react';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hooks/useUsers';
import { Modal } from '../components/ui/Modal';
import type { User, CreateUserDto, UpdateUserDto, UserRole } from '../types/user';

const roles: UserRole[] = ['Employee', 'Supervisor', 'Admin'];

const emptyCreateForm: CreateUserDto = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  supervisorId: undefined,
};

export function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState<CreateUserDto>(emptyCreateForm);
  const [editForm, setEditForm] = useState<UpdateUserDto>({
    name: '',
    role: 'Employee',
    supervisorId: undefined,
  });

  function openCreateModal() {
    setEditingUser(null);
    setCreateForm(emptyCreateForm);
    setIsModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      role: user.role,
      supervisorId: user.supervisorId,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingUser) {
      await updateMutation.mutateAsync({ id: editingUser.id, dto: editForm });
    } else {
      await createMutation.mutateAsync(createForm);
    }

    closeModal();
  }

  async function handleDeactivate(id: number) {
    if (!confirm('¿Desactivar este usuario?')) return;
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-600">Error al cargar usuarios.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Usuarios</h1>
        <button
          onClick={openCreateModal}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo usuario
        </button>
      </div>

      <table className="w-full rounded-lg bg-white shadow">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3">Supervisor</th>
            <th className="p-3">Estado</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id} className="border-b text-sm">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">{u.supervisorName || '—'}</td>
              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    u.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {u.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="space-x-2 p-3 text-right">
                <button
                  onClick={() => openEditModal(u)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                {u.isActive && (
                  <button
                    onClick={() => handleDeactivate(u.id)}
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
        title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <form onSubmit={handleSubmit}>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            value={editingUser ? editForm.name : createForm.name}
            onChange={(e) => {
                if (editingUser) {
                    setEditForm({ ...editForm, name: e.target.value });
                } else {
                    setCreateForm({ ...createForm, name: e.target.value });
                }
            }}
            className="mb-3 w-full rounded border border-gray-300 p-2"
            required
          />

          {!editingUser && (
            <>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                className="mb-3 w-full rounded border border-gray-300 p-2"
                required
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                className="mb-3 w-full rounded border border-gray-300 p-2"
                required
              />
            </>
          )}

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rol
          </label>
          <select
            value={editingUser ? editForm.role : createForm.role}
            onChange={(e) => {
              const role = e.target.value as UserRole;
              if(editingUser) {
                  setEditForm({ ...editForm, role })
              } else {
                  setCreateForm({ ...createForm, role });
              }
            }}
            className="mb-3 w-full rounded border border-gray-300 p-2"
            required
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Supervisor (opcional)
          </label>
          <select
            value={
              (editingUser ? editForm.supervisorId : createForm.supervisorId) ?? ''
            }
            onChange={(e) => {
              const supervisorId = e.target.value
                ? Number(e.target.value)
                : undefined;
              if(editingUser) {
                  setEditForm({ ...editForm, supervisorId })
              } else {
                  setCreateForm({ ...createForm, supervisorId });
              }
            }}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          >
            <option value="">Sin supervisor</option>
            {users
              ?.filter((u) => u.isActive && u.id !== editingUser?.id)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
          </select>

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
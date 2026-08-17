import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded text-sm font-medium ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="border-b bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/purchase-orders" className={linkClass}>
            Órdenes de compra
          </NavLink>

          {(user?.role === 'Admin' || user?.role === 'Supervisor') && (
            <NavLink to="/approvals" className={linkClass}>
              Aprobaciones
            </NavLink>
          )}

          {user?.role === 'Admin' && (
            <>
              <NavLink to="/suppliers" className={linkClass}>
                Proveedores
              </NavLink>
              <NavLink to="/products" className={linkClass}>
                Productos
              </NavLink>
              <NavLink to="/users" className={linkClass}>
                Usuarios
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name} · {user?.role}
          </span>
          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
import { Link } from 'react-router-dom';
import { usePurchaseOrders } from '../../hooks/usePurchaseOrders';

const statusColors: Record<string, string> = {
  Created: 'bg-blue-100 text-blue-700',
  Approved: 'bg-teal-100 text-teal-700',
  Sent: 'bg-amber-100 text-amber-700',
  Delivered: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

export function PurchaseOrdersPage() {
  const { data: orders, isLoading, error } = usePurchaseOrders();

  if (isLoading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="text-red-600">Error al cargar las órdenes.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Órdenes de compra</h1>
        <Link
          to="/purchase-orders/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nueva orden
        </Link>
      </div>

      <table className="w-full rounded-lg bg-white shadow">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="p-3">Número</th>
            <th className="p-3">Proveedor</th>
            <th className="p-3">Empleado</th>
            <th className="p-3">Total</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o.id} className="border-b text-sm">
              <td className="p-3">
                <Link
                  to={`/purchase-orders/${o.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {o.number}
                </Link>
              </td>
              <td className="p-3">{o.supplierName}</td>
              <td className="p-3">{o.employeeName}</td>
              <td className="p-3">${o.totalAmount.toFixed(2)}</td>
              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-xs ${statusColors[o.status]}`}
                >
                  {o.status}
                </span>
              </td>
              <td className="p-3">
                {new Date(o.createdAt).toLocaleDateString('es-AR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders?.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          No hay órdenes para mostrar.
        </p>
      )}
    </div>
  );
}
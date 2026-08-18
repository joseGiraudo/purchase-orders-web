import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseOrder, useChangeOrderStatus } from '../../hooks/usePurchaseOrders';
import { useAuth } from '../../hooks/useAuth';
import type { OrderStatus } from '../../types/purchaseOrder';

const nextStatusOptions: Record<OrderStatus, { label: string; status: OrderStatus }[]> = {
  Created: [
    { label: 'Aprobar', status: 'Approved' },
    { label: 'Rechazar', status: 'Rejected' },
    { label: 'Cancelar', status: 'Cancelled' },
  ],
  Approved: [
    { label: 'Marcar como enviada', status: 'Sent' },
    { label: 'Cancelar', status: 'Cancelled' },
  ],
  Sent: [{ label: 'Marcar como entregada', status: 'Delivered' }],
  Delivered: [],
  Rejected: [],
  Cancelled: [],
};

export function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = usePurchaseOrder(Number(id));
  const changeStatusMutation = useChangeOrderStatus();

  async function handleChangeStatus(newStatus: OrderStatus) {
    if (!order || !user) return;

    let comment: string | undefined;
    if (newStatus === 'Rejected') {
      comment = prompt('Motivo del rechazo:') ?? undefined;
      if (!comment) return; // el usuario canceló el prompt
    }

    await changeStatusMutation.mutateAsync({
      id: order.id,
      dto: { newStatus, changedByUserId: user.id, comment },
    });
  }

  if (isLoading) return <p>Cargando orden...</p>;
  if (error || !order) return <p className="text-red-600">No se encontró la orden.</p>;

  const availableActions = nextStatusOptions[order.status];
  const canManage = user?.role === 'Supervisor' || user?.role === 'Admin';

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/purchase-orders')}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver al listado
      </button>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{order.number}</h1>
            <p className="text-sm text-gray-500">
              {order.supplierName} · Solicitado por {order.employeeName}
            </p>
          </div>
          <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {order.status}
          </span>
        </div>

        {order.rejectionReason && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
            Motivo de rechazo: {order.rejectionReason}
          </p>
        )}

        <table className="mb-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="p-2">Producto</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Precio unitario</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.productName}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">${item.unitPrice.toFixed(2)}</td>
                <td className="p-2">${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-right text-lg font-bold text-gray-800">
          Total: ${order.totalAmount.toFixed(2)}
        </p>

        {canManage && availableActions.length > 0 && (
          <div className="mt-4 flex justify-end gap-2 border-t pt-4">
            {availableActions.map((action) => (
              <button
                key={action.status}
                onClick={() => handleChangeStatus(action.status)}
                disabled={changeStatusMutation.isPending}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-3 text-sm font-bold text-gray-800">Historial</h2>
        <ul className="space-y-2">
          {order.statusHistory.map((entry, index) => (
            <li key={index} className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{entry.newStatus}</span>
              {' — '}
              {entry.changedByName} ·{' '}
              {new Date(entry.changedAt).toLocaleString('es-AR')}
              {entry.comment && <span className="italic"> · {entry.comment}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
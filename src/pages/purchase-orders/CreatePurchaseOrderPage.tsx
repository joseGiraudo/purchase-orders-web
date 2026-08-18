import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useProducts } from '../../hooks/useProducts';
import { useCreatePurchaseOrder } from '../../hooks/usePurchaseOrders';
import { useAuth } from '../../hooks/useAuth';
import type { CreateOrderItemDto } from '../../types/purchaseOrder';

export function CreatePurchaseOrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: suppliers } = useSuppliers();
  const createMutation = useCreatePurchaseOrder();

  const [supplierId, setSupplierId] = useState(0);
  const [items, setItems] = useState<CreateOrderItemDto[]>([]);
  const [error, setError] = useState('');

  const { data: products } = useProducts(supplierId || undefined);

  function handleSupplierChange(newSupplierId: number) {
    setSupplierId(newSupplierId);
    setItems([]); // si cambiás de proveedor, los ítems ya no aplican
  }

  function addItem() {
    if (!products || products.length === 0) return;
    setItems([...items, { productId: products[0].id, quantity: 1 }]);
  }

  function updateItem(index: number, changes: Partial<CreateOrderItemDto>) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...changes };
    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function calculateTotal() {
    return items.reduce((total, item) => {
      const product = products?.find((p) => p.id === item.productId);
      return total + (product?.referencePrice ?? 0) * item.quantity;
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!supplierId) {
      setError('Seleccioná un proveedor.');
      return;
    }
    if (items.length === 0) {
      setError('Agregá al menos un ítem.');
      return;
    }

    try {
      const order = await createMutation.mutateAsync({
        employeeId: user!.id,
        supplierId,
        items,
      });
      navigate(`/purchase-orders/${order.id}`);
    } catch {
      setError('No se pudo crear la orden. Verificá los datos ingresados.');
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-gray-800">Nueva orden de compra</h1>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Proveedor
        </label>
        <select
          value={supplierId}
          onChange={(e) => handleSupplierChange(Number(e.target.value))}
          className="mb-4 w-full rounded border border-gray-300 p-2"
        >
          <option value={0}>Seleccioná un proveedor</option>
          {suppliers
            ?.filter((s) => s.isActive)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {supplierId > 0 && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Ítems</label>
              <button
                type="button"
                onClick={addItem}
                disabled={!products || products.length === 0}
                className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
              >
                + Agregar ítem
              </button>
            </div>

            {items.length === 0 && (
              <p className="mb-4 text-sm text-gray-500">
                Todavía no agregaste ningún ítem.
              </p>
            )}

            {items.map((item, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <select
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(index, { productId: Number(e.target.value) })
                  }
                  className="flex-1 rounded border border-gray-300 p-2 text-sm"
                >
                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.referencePrice.toFixed(2)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, { quantity: Number(e.target.value) })
                  }
                  className="w-20 rounded border border-gray-300 p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Quitar
                </button>
              </div>
            ))}

            {items.length > 0 && (
              <p className="mb-4 mt-2 text-right text-sm font-medium text-gray-700">
                Total estimado: ${calculateTotal().toFixed(2)}
              </p>
            )}
          </>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/purchase-orders')}
            className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear orden'}
          </button>
        </div>
      </form>
    </div>
  );
}
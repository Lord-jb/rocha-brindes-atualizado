import { For, Show, createSignal } from 'solid-js';
import { Eye, Clock } from 'lucide-solid';
import { formatPrice, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: number;
}

interface Props {
  orders: Order[];
}

export default function AdminOrdersList(props: Props) {
  const [orders, setOrders] = createSignal(props.orders);
  const [updating, setUpdating] = createSignal<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Aguardando',
      processing: 'Em Produção',
      shipped: 'Em Transporte',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders().map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div class="bg-white rounded-xl shadow-card overflow-hidden">
      <Show
        when={orders().length > 0}
        fallback={
          <div class="p-12 text-center">
            <p class="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        }
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={orders()}>
                {(order) => (
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900">
                        #{order.order_number}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{order.customer_name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-600">
                        <div>{order.customer_email}</div>
                        <div>{order.customer_phone}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900">
                        {formatPrice(order.total_amount)}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.currentTarget.value)}
                        disabled={updating() === order.id}
                        class={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusColor(order.status)} disabled:opacity-50`}
                      >
                        <option value="pending">Aguardando</option>
                        <option value="processing">Em Produção</option>
                        <option value="shipped">Em Transporte</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/pedido/${order.order_number}`}
                        target="_blank"
                        class="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
                      >
                        <Eye size={16} />
                        Ver
                      </a>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}

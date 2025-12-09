import { For } from 'solid-js';
import { Package, FolderOpen, ShoppingCart, DollarSign, Clock } from 'lucide-solid';
import { formatPrice, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: number;
}

interface Props {
  stats: {
    total_products: number;
    active_products: number;
    total_categories: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
    recent_orders: Order[];
  };
}

export default function AdminStats(props: Props) {
  const statCards = [
    {
      label: 'Total de Produtos',
      value: props.stats.total_products,
      subtext: `${props.stats.active_products} ativos`,
      icon: Package,
      color: 'bg-primary-500',
    },
    {
      label: 'Categorias',
      value: props.stats.total_categories,
      subtext: 'cadastradas',
      icon: FolderOpen,
      color: 'bg-secondary-700',
    },
    {
      label: 'Pedidos',
      value: props.stats.total_orders,
      subtext: `${props.stats.pending_orders} pendentes`,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      label: 'Receita Total',
      value: formatPrice(props.stats.total_revenue),
      subtext: 'todos os pedidos',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
  ];

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

  return (
    <div class="space-y-8">
      {/* Stat Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <For each={statCards}>
          {(stat) => {
            const Icon = stat.icon;
            return (
              <div class="bg-white rounded-xl shadow-card p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} class="text-white" />
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p class="text-sm font-medium text-gray-700">{stat.label}</p>
                <p class="text-xs text-gray-500 mt-1">{stat.subtext}</p>
              </div>
            );
          }}
        </For>
      </div>

      {/* Recent Orders */}
      {props.stats.recent_orders && props.stats.recent_orders.length > 0 && (
        <div class="bg-white rounded-xl shadow-card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-display font-bold text-gray-900">
              Pedidos Recentes
            </h2>
          </div>
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
                <For each={props.stats.recent_orders}>
                  {(order) => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-900">{order.customer_name}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-medium text-gray-900">
                          {formatPrice(order.total_amount)}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`/admin/pedidos/${order.id}`}
                          class="text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                          Ver detalhes
                        </a>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-solid';

interface Props {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export default function OrderStatus(props: Props) {
  const statusConfig = {
    pending: {
      label: 'Aguardando',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    processing: {
      label: 'Em Produção',
      icon: Package,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    shipped: {
      label: 'Em Transporte',
      icon: Truck,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    delivered: {
      label: 'Entregue',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    cancelled: {
      label: 'Cancelado',
      icon: XCircle,
      color: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config = statusConfig[props.status];
  const Icon = config.icon;

  return (
    <div class={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${config.color}`}>
      <Icon size={20} />
      {config.label}
    </div>
  );
}

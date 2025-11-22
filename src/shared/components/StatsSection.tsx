// src/shared/components/StatsSection.tsx
interface StatsSectionProps {
  stats: {
    products: { value: string; label: string }
    clients: { value: string; label: string }
    years: { value: string; label: string }
  }
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="mb-16 grid grid-cols-3 gap-8 text-center">
      <div>
        <p className="text-4xl font-bold text-primary mb-2">{stats.products.value}</p>
        <p className="text-gray-600">{stats.products.label}</p>
      </div>
      <div>
        <p className="text-4xl font-bold text-primary mb-2">{stats.clients.value}</p>
        <p className="text-gray-600">{stats.clients.label}</p>
      </div>
      <div>
        <p className="text-4xl font-bold text-primary mb-2">{stats.years.value}</p>
        <p className="text-gray-600">{stats.years.label}</p>
      </div>
    </section>
  )
}
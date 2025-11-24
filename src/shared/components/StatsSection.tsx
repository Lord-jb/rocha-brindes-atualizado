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
    <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div>
        <p className="text-4xl font-bold text-primary mb-2">{stats.products.value}</p>
        <p className="text-gray-600">{stats.products.label}</p>
      </div>
      <div className="md:border-l md:border-gray-200 md:pl-6 md:ml-6">
        <p className="text-4xl font-bold text-primary mb-2">{stats.clients.value}</p>
        <p className="text-gray-600">{stats.clients.label}</p>
      </div>
      <div className="md:border-l md:border-gray-200 md:pl-6 md:ml-6">
        <p className="text-4xl font-bold text-primary mb-2">{stats.years.value}</p>
        <p className="text-gray-600">{stats.years.label}</p>
      </div>
      <div className="md:col-span-3 text-center mt-2">
        <a
          href="/catalogo"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all shadow-lg hover:shadow-xl"
        >
          Ver catálogo
        </a>
      </div>
    </section>
  )
}

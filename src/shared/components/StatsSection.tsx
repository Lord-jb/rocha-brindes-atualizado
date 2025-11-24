// FILE: src/shared/components/StatsSection.tsx
interface StatsSectionProps {
  stats: {
    products: { value: string; label: string }
    clients: { value: string; label: string }
    years: { value: string; label: string }
  }
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center mb-6">
        <div className="p-3 sm:p-4 bg-white rounded-xl shadow-sm">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stats.products.value}</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">{stats.products.label}</p>
        </div>
        <div className="p-3 sm:p-4 bg-white rounded-xl shadow-sm">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stats.clients.value}</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">{stats.clients.label}</p>
        </div>
        <div className="p-3 sm:p-4 bg-white rounded-xl shadow-sm">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stats.years.value}</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">{stats.years.label}</p>
        </div>
      </div>
      <div className="text-center">
        <a
          href="/catalogo"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl"
        >
          Ver catálogo
        </a>
      </div>
    </section>
  )
}
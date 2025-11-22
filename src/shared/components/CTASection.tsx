// src/shared/components/CTASection.tsx
interface CTASectionProps {
  title: string
  description: string
  buttonText: string
}

export default function CTASection({ title, description, buttonText }: CTASectionProps) {
  return (
    <section className="mb-16 bg-white rounded-2xl shadow-card p-8 text-center">
      <h2 className="text-3xl font-title font-bold text-dark mb-4">
        {title}
      </h2>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      <a
        href="/catalogo"
        className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
      >
        {buttonText}
      </a>
    </section>
  )
}
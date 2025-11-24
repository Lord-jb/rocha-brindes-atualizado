// FILE: src/shared/components/CTASection.tsx
interface CTASectionProps {
  title: string
  description: string
  buttonText: string
}

export default function CTASection({ title, description, buttonText }: CTASectionProps) {
  return (
    <section className="mb-8 sm:mb-12 bg-white rounded-xl sm:rounded-2xl shadow-card p-5 sm:p-8 text-center">
      <h2 className="text-2xl sm:text-3xl font-title font-bold text-dark mb-3 sm:mb-4">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl mx-auto">
        {description}
      </p>
      <a
        href="/catalogo"
        className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all shadow-lg hover:shadow-xl"
      >
        {buttonText}
      </a>
    </section>
  )
}
// src/shared/components/HeroSection.tsx
interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText?: string
}

export default function HeroSection({ title, subtitle, ctaText }: HeroSectionProps) {
  return (
    <section className="mb-16 text-center">
      <h1 className="text-4xl md:text-6xl font-title font-bold text-dark mb-6">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">
        {subtitle}
      </p>
      {ctaText && (
        <a
          href="/catalogo"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
        >
          {ctaText}
        </a>
      )}
    </section>
  )
}

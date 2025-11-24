// FILE: src/shared/components/HeroSection.tsx
interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText?: string
}

export default function HeroSection({ title, subtitle, ctaText }: HeroSectionProps) {
  return (
    <section className="mb-8 sm:mb-12 text-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title font-bold text-dark mb-4 sm:mb-6 leading-tight">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
        {subtitle}
      </p>
      {ctaText && (
        <a
          href="/catalogo"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all shadow-lg hover:shadow-xl"
        >
          {ctaText}
        </a>
      )}
    </section>
  )
}
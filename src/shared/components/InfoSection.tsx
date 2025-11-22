// src/shared/components/InfoSection.tsx
interface InfoSectionProps {
  title: string
  description: string
  imageUrl?: string
  imagePosition?: 'left' | 'right'
  features?: string[]
}

export default function InfoSection({ 
  title, 
  description, 
  imageUrl, 
  imagePosition = 'right',
  features 
}: InfoSectionProps) {
  return (
    <section className="mb-16">
      <div className={`bg-white rounded-2xl shadow-card overflow-hidden ${
        imagePosition === 'left' ? 'md:flex-row-reverse' : ''
      }`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Conteúdo de Texto */}
          <div className={`p-8 md:p-12 ${imagePosition === 'left' ? 'md:order-2' : ''}`}>
            <h2 className="text-2xl md:text-3xl font-title font-bold text-dark mb-6">
              {title}
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {description}
            </p>
            
            {features && features.length > 0 && (
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg 
                      className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Imagem */}
          <div className={`relative h-64 md:h-full min-h-[400px] bg-gradient-to-br from-primary/10 to-accent/10 ${
            imagePosition === 'left' ? 'md:order-1' : ''
          }`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-20">🎁</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
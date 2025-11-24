// FILE: src/shared/components/VideoSection.tsx
interface VideoItem {
  url: string
  title?: string
  thumbnail?: string
}

interface VideoSectionProps {
  videos: VideoItem[]
}

export default function VideoSection({ videos }: VideoSectionProps) {
  if (videos.length === 0) return null

  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-title font-bold text-dark mb-6 sm:mb-8 text-center px-4">
        Conheça um pouco mais da nossa produção
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {videos.map((video, idx) => (
          <div 
            key={idx} 
            className="group"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <video
                  src={video.url}
                  poster={video.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              
              {video.title && (
                <div className="p-3 sm:p-4 bg-white">
                  <h3 className="font-bold text-sm sm:text-base text-dark text-center group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
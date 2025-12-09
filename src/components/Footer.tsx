import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-solid';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="bg-gray-900 text-gray-300 mt-auto">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 class="text-white font-display font-bold text-xl mb-4">Rocha Brindes</h3>
            <p class="text-sm leading-relaxed mb-4">
              Especialistas em brindes personalizados de alta qualidade para empresas e eventos.
            </p>
            <div class="flex space-x-3">
              <a
                href="https://www.instagram.com/rochabrindesoficial"
                target="_blank"
                rel="noopener"
                class="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram class="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61576684446307"
                target="_blank"
                rel="noopener"
                class="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook class="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul class="space-y-2">
              <li>
                <a href="/" class="hover:text-primary-500 transition-colors">Início</a>
              </li>
              <li>
                <a href="/loja" class="hover:text-primary-500 transition-colors">Loja</a>
              </li>
              <li>
                <a href="/sobre" class="hover:text-primary-500 transition-colors">Sobre Nós</a>
              </li>
              <li>
                <a href="/contato" class="hover:text-primary-500 transition-colors">Contato</a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 class="text-white font-semibold text-lg mb-4">Contato</h3>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start space-x-2">
                <Phone class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>(96) 8124-7830</span>
              </li>
              <li class="flex items-start space-x-2">
                <Mail class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>rochabrindes29@gmail.com</span>
              </li>
              <li class="flex items-start space-x-2">
                <MapPin class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>Macapá - AP</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {year} Rocha Brindes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

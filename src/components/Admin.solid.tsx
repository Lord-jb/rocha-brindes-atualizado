// FILE: src/components/Admin.solid.tsx
import { createSignal, Show } from 'solid-js';
import Providers from './Providers.solid';

function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleLogin = (e: Event) => {
    e.preventDefault();
    // TODO: Implementar autenticação real
    if (email() && password()) {
      setIsAuthenticated(true);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100">
      <Show
        when={isAuthenticated()}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
              <form onSubmit={handleLogin} class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Entrar
                </button>
              </form>
            </div>
          </div>
        }
      >
        <div class="container mx-auto px-4 py-8">
          <div class="bg-white rounded-xl shadow p-6">
            <h1 class="text-3xl font-bold mb-6">Painel Administrativo</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-primary/10 p-6 rounded-lg">
                <h3 class="text-xl font-bold mb-2">Produtos</h3>
                <p class="text-gray-600">Gerenciar produtos do catálogo</p>
              </div>
              <div class="bg-primary/10 p-6 rounded-lg">
                <h3 class="text-xl font-bold mb-2">Categorias</h3>
                <p class="text-gray-600">Gerenciar categorias</p>
              </div>
              <div class="bg-primary/10 p-6 rounded-lg">
                <h3 class="text-xl font-bold mb-2">Layout</h3>
                <p class="text-gray-600">Configurar layout do site</p>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default function Admin() {
  return (
    <Providers>
      <AdminContent />
    </Providers>
  );
}

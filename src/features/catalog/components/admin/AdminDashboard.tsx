// FILE: src/features/catalog/components/admin/AdminDashboard.tsx
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../../../core/lib/firebase'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import CategoryManager from './CategoryManager'
import LayoutManager from './LayoutManager'
import LandingManager from './LandingManager'
import { LogOut, Package, Grid, Home, Settings, Menu, X } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'landing' | 'config'>('products')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
  }

  const tabs = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: Grid },
    { id: 'landing', label: 'Página Inicial', icon: Home },
    { id: 'config', label: 'Configurações', icon: Settings }
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-title font-bold">Painel Admin</h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <nav className={`${menuOpen ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0`}>
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 lg:py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:py-8">
        {activeTab === 'products' && (
          <div className="space-y-6 lg:space-y-8">
            <ProductForm />
            <ProductList />
          </div>
        )}

        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'landing' && <LandingManager />}
        {activeTab === 'config' && <LayoutManager />}
      </main>
    </div>
  )
}
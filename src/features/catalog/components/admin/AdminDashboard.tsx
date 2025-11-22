// src/features/catalog/components/admin/AdminDashboard.tsx - REMOVER companyInfo, manter só Landing

import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../../../core/lib/firebase'
import ProductForm from '../../../../features/catalog/components/admin/ProductForm'
import ProductList from './ProductList'
import CategoryManager from '../../../../features/catalog/components/admin/CategoryManager'
import LayoutManager from '../../../../features/catalog/components/admin/LayoutManager'
import LandingManager from '../../../../features/catalog/components/admin/LandingManager'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'landing' | 'config'>('products')

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-title font-bold">Painel Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'landing'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Página Inicial
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'config'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Configurações
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <ProductForm />
            <ProductList />
          </div>
        )}

        {activeTab === 'categories' && <CategoryManager />}

        {activeTab === 'landing' && <LandingManager />}

        {activeTab === 'config' && <LayoutManager />}
      </div>
    </div>
  )
}
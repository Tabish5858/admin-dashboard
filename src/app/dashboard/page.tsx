'use client'

import { useAuthStore } from '@/lib/store/useAuthStore'
import { motion } from 'framer-motion'
import { useProductStore } from '@/lib/store/useProductStore'

export default function DashboardPage() {
  const user = useAuthStore(state => state.user)
  const products = useProductStore(state => state.products)

  const totalProducts = products.length
  const productsOnSale = products.filter(p => p.salePrice).length
  const averagePrice = products.reduce((acc, p) => acc + p.price, 0) / totalProducts || 0

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.email}!</h2>
        <p className="text-indigo-100">Here&apos;s an overview of your store</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:text-start text-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow lg:text-start text-center"
        >
          <div className="text-gray-500 text-sm font-medium mb-2">Total Products</div>
          <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow lg:text-start text-center"
        >
          <div className="text-gray-500 text-sm font-medium mb-2">Products on Sale</div>
          <div className="text-3xl font-bold text-gray-900">{productsOnSale}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow lg:text-start text-center"
        >
          <div className="text-gray-500 text-sm font-medium mb-2">Average Price</div>
          <div className="text-3xl font-bold text-gray-900">${averagePrice.toFixed(2)}</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/products'}
            className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="font-medium text-gray-900 group-hover:text-indigo-600">Add New Product</div>
            <div className="text-sm text-gray-500">Create and publish a new product</div>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/products'}
            className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="font-medium text-gray-900 group-hover:text-indigo-600">Manage Sales</div>
            <div className="text-sm text-gray-500">Update prices and promotions</div>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/settings'}
            className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div className="font-medium text-gray-900 group-hover:text-indigo-600">Settings</div>
            <div className="text-sm text-gray-500">Configure your account</div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

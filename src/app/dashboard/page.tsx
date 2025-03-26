'use client'

import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import PieChart from '@/components/charts/PieChart'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useOrderStore } from '@/lib/store/useOrderStore'
import { useProductStore } from '@/lib/store/useProductStore'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000, target: 2400 },
  { name: 'Feb', sales: 3000, target: 2800 },
  { name: 'Mar', sales: 5000, target: 3200 },
  { name: 'Apr', sales: 2780, target: 3500 },
  { name: 'May', sales: 3890, target: 3800 },
  { name: 'Jun', sales: 6390, target: 4000 },
]

export default function DashboardPage() {
  const user = useAuthStore(state => state.user)
  const products = useProductStore(state => state.products)
  const fetchProducts = useProductStore(state => state.fetchProducts)
  const orders = useOrderStore(state => state.orders)
  const fetchOrders = useOrderStore(state => state.fetchOrders)

  const totalProducts = products.length
  const productsOnSale = products.filter(p => p.salePrice).length
  const averagePrice = products.reduce((acc, p) => acc + p.price, 0) / totalProducts || 0

  // Calculate product categories dynamically
  const productCategories = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const productCategoryData = Object.entries(productCategories).map(([name, value]) => ({
    name,
    value
  }))

  // Order-related calculations
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)
  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const averageOrderValue = totalRevenue / totalOrders || 0

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [fetchProducts, fetchOrders])

  // Generate data for products price chart
  const productPriceData = products.slice(0, 8).map(product => ({
    name: product.name.length > 10 ? product.name.slice(0, 10) + '...' : product.name,
    price: product.price,
    salePrice: product.salePrice || 0
  }))

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/60 rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-primary-foreground mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-primary-foreground/80">Here&apos;s an overview of your store</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Products</div>
          <div className="text-3xl font-bold text-foreground">{totalProducts}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Orders</div>
          <div className="text-3xl font-bold text-foreground">{totalOrders}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-muted-foreground text-sm font-medium mb-2">Avg Order Value</div>
          <div className="text-3xl font-bold text-foreground">${averageOrderValue.toFixed(2)}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LineChart
            data={salesData}
            lines={[
              { dataKey: 'sales', color: '#6366f1', name: 'Sales' },
              { dataKey: 'target', color: '#22c55e', name: 'Target' }
            ]}
            title="Monthly Sales Performance"
            subtitle="Sales vs Target (Last 6 months)"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PieChart
            data={productCategoryData}
            title="Product Categories"
            subtitle="Distribution by category"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <BarChart
          data={productPriceData}
          dataKey="price"
          title="Product Price Comparison"
          subtitle="Regular prices vs sale prices"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card-background rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/5">
                  <td className="py-3 px-4 text-sm">{order.id}</td>
                  <td className="py-3 px-4 text-sm">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                      }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card-background rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/products'}
            className="p-4 text-left bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
          >
            <div className="font-medium text-foreground group-hover:text-primary">Add New Product</div>
            <div className="text-sm text-muted-foreground">Create and publish a new product</div>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/products'}
            className="p-4 text-left bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
          >
            <div className="font-medium text-foreground group-hover:text-primary">Manage Sales</div>
            <div className="text-sm text-muted-foreground">Update prices and promotions</div>
          </button>

          <button
            onClick={() => window.location.href = '/dashboard/settings'}
            className="p-4 text-left bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
          >
            <div className="font-medium text-foreground group-hover:text-primary">Settings</div>
            <div className="text-sm text-muted-foreground">Configure your account</div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

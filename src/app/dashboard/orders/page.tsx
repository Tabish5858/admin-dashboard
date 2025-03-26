'use client'

import { useOrderStore } from '@/lib/store/useOrderStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function OrdersPage() {
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter)

  const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total, 0)

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-card-background rounded-lg p-6 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Orders</div>
          <div className="text-3xl font-bold text-foreground">{filteredOrders.length}</div>
        </div>
        <div className="bg-card-background rounded-lg p-6 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-card-background rounded-lg p-6 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium mb-2">Average Order Value</div>
          <div className="text-3xl font-bold text-foreground">
            ${(totalRevenue / filteredOrders.length || 0).toFixed(2)}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card-background rounded-lg shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/5">
                  <td className="py-4 px-6">{order.id}</td>
                  <td className="py-4 px-6">{order.customerName}</td>
                  <td className="py-4 px-6">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
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
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className="px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

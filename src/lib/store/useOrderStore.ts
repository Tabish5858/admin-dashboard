import { create } from "zustand";

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      const mockOrders: Order[] = [
        {
          id: "1",
          customerName: "John Doe",
          orderDate: new Date().toISOString(),
          total: 299.99,
          status: "pending",
          items: [{ productId: "1", quantity: 2, price: 149.99 }],
        },
        // Add more mock orders as needed
      ];
      set({ orders: mockOrders, error: null });
    } catch (error) {
      set({ error: "Failed to fetch orders" });
    } finally {
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
}));

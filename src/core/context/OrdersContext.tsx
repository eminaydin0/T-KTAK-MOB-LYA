import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import type { CommChannel, Order, OrderCommunication, OrderLine, OrderStatus } from '../orders/types'
import { loadOrders, nextReferenceCode, saveOrders } from '../orders/storage'
import { useState } from 'react'

type OrdersContextValue = {
  orders: Order[]
  updateOrderStatus: (id: string, status: OrderStatus) => void
  updateOrder: (
    id: string,
    patch: Partial<Pick<Order, 'status' | 'note' | 'internalNotes' | 'customerName' | 'phone'>>
  ) => void
  addOrderCommunication: (orderId: string, input: { channel: CommChannel; message: string }) => void
  addOrder: (input: {
    customerName: string
    phone: string
    lines: { productId?: number; productName: string; qty: number }[]
    note?: string
  }) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders())

  useEffect(() => {
    saveOrders(orders)
  }, [orders])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        if (o.status === status) return o
        return {
          ...o,
          status,
          statusLog: [...(o.statusLog ?? []), { at: new Date().toISOString(), from: o.status, to: status }],
        }
      })
    )
  }, [])

  const updateOrder = useCallback(
    (
      id: string,
      patch: Partial<Pick<Order, 'status' | 'note' | 'internalNotes' | 'customerName' | 'phone'>>
    ) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o
          const next = { ...o, ...patch }
          if (patch.status !== undefined && patch.status !== o.status) {
            next.statusLog = [
              ...(o.statusLog ?? []),
              { at: new Date().toISOString(), from: o.status, to: patch.status },
            ]
          }
          return next
        })
      )
    },
    []
  )

  const addOrderCommunication = useCallback((orderId: string, input: { channel: CommChannel; message: string }) => {
    const message = input.message.trim()
    if (!message) return
    const id = `comm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const row: OrderCommunication = {
      id,
      at: new Date().toISOString(),
      channel: input.channel,
      message,
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, communications: [...(o.communications ?? []), row] } : o))
    )
  }, [])

  const addOrder = useCallback(
    (input: {
      customerName: string
      phone: string
      lines: { productId?: number; productName: string; qty: number }[]
      note?: string
    }) => {
      const name = input.customerName.trim()
      const phone = input.phone.trim()
      if (!name || !phone || input.lines.length === 0) return

      const lines: OrderLine[] = input.lines
        .filter((l) => l.productName.trim() && l.qty > 0)
        .map((l) => {
          const qty = Math.max(1, Math.floor(l.qty))
          const productName = l.productName.trim()
          const line: OrderLine = { productName, qty }
          if (l.productId !== undefined) line.productId = l.productId
          return line
        })
      if (lines.length === 0) return

      const next: Order = {
        id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        referenceCode: nextReferenceCode(),
        createdAt: new Date().toISOString(),
        customerName: name,
        phone,
        lines,
        status: 'yeni',
        note: input.note?.trim() || undefined,
        internalNotes: undefined,
        communications: [],
        statusLog: [],
      }
      setOrders((prev) => [next, ...prev])
    },
    []
  )

  const value = useMemo(
    () => ({
      orders,
      updateOrderStatus,
      updateOrder,
      addOrderCommunication,
      addOrder,
    }),
    [orders, updateOrderStatus, updateOrder, addOrderCommunication, addOrder]
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}

export interface CartItem {
  id: string
  name: string
  price: string
  image: string
  quantity?: number
}

const CART_STORAGE_KEY = 'cart_items'

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  const items = localStorage.getItem(CART_STORAGE_KEY)
  return items ? JSON.parse(items) : []
}

export const addToCart = (item: CartItem) => {
  const items = getCartItems()
  const existingItem = items.find(i => i.id === item.id)
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    items.push({ ...item, quantity: 1 })
  }
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  return items
}

export const removeFromCart = (id: string) => {
  const items = getCartItems()
  const existingItem = items.find(i => i.id === id)
  
  if (existingItem) {
    if (existingItem.quantity && existingItem.quantity > 1) {
      existingItem.quantity -= 1
    } else {
      const index = items.findIndex(i => i.id === id)
      items.splice(index, 1)
    }
  }
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  return items
}

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY)
  return []
}

export const getCartTotal = () => {
  const items = getCartItems()
  return items.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ''))
    return total + (price * (item.quantity || 1))
  }, 0)
}

export const getCartItemCount = () => {
  const items = getCartItems()
  return items.reduce((count, item) => count + (item.quantity || 1), 0)
} 
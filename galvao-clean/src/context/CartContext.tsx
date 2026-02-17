import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"


type Product = {
  name: string
  price: number
}

type CartContextType = {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
}



const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {

  const [cart, setCart] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  function addToCart(product: Product) {
    setCart(prev => [...prev, product])
  }
  function removeFromCart(index: number) {
  setCart(prev => prev.filter((_, i) => i !== index))
}
function clearCart() {
  setCart([])
}


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>


      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used inside CartProvider")
  }
  return context
}

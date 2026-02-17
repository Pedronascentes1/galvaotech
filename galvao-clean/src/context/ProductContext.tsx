import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

export type Product = {
  id: number
  name: string
  description: string
  category: string
  price: number
  discountPrice?: number
  image: string
}

type ProductContextType = {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  removeProduct: (id: number) => void
  updateProduct: (product: Product) => void
}

const ProductContext = createContext<ProductContextType | null>(null)

const API_URL = "https://galvaotech.onrender.com/products"

export function ProductProvider({ children }: { children: ReactNode }) {

  const [products, setProducts] = useState<Product[]>([])

  // 🔥 Buscar produtos
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Erro ao buscar produtos:", err))
  }, [])

  // 🔥 Criar produto
  async function addProduct(product: Omit<Product, "id">) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(product)
      })

      const newProduct = await response.json()

      if (!response.ok) {
        console.error(newProduct)
        alert("Erro ao criar produto")
        return
      }

      setProducts(prev => [...prev, newProduct])

    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
    }
  }

  // 🔥 Deletar produto
  async function removeProduct(id: number) {
    try {
      const token = localStorage.getItem("token")

      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error("Erro ao remover produto:", error)
    }
  }

  // 🔥 Atualizar produto
  async function updateProduct(updatedProduct: Product) {
    try {
      const token = localStorage.getItem("token")

      await fetch(`${API_URL}/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      })

      setProducts(prev =>
        prev.map(p =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      )

    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
    }
  }

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider")
  }
  return context
}
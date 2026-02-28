import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import toast from "react-hot-toast"

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
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  removeProduct: (id: number) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | null>(null)

const API_URL = "https://galvaotech.onrender.com/products"

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  async function refreshProducts() {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || "Erro ao buscar produtos")
        return
      }
      setProducts(data)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao buscar produtos")
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  async function addProduct(product: Omit<Product, "id">) {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Você precisa estar logado")
      return
    }

    const loadingId = toast.loading("Criando produto...")

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.dismiss(loadingId)
        toast.error(data?.message || data?.error || "Erro ao criar produto")
        return
      }

      setProducts(prev => [...prev, data])
      toast.dismiss(loadingId)
      toast.success("Produto criado com sucesso ✅")
    } catch (error) {
      console.error(error)
      toast.dismiss(loadingId)
      toast.error("Erro ao criar produto")
    }
  }

  async function removeProduct(id: number) {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Você precisa estar logado")
      return
    }

    const loadingId = toast.loading("Removendo produto...")

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.dismiss(loadingId)
        toast.error(data?.message || data?.error || "Erro ao remover produto")
        return
      }

      setProducts(prev => prev.filter(p => p.id !== id))
      toast.dismiss(loadingId)
      toast.success("Produto removido ✅")
    } catch (error) {
      console.error(error)
      toast.dismiss(loadingId)
      toast.error("Erro ao remover produto")
    }
  }

  async function updateProduct(updatedProduct: Product) {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Você precisa estar logado")
      return
    }

    const loadingId = toast.loading("Atualizando produto...")

    try {
      const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        toast.dismiss(loadingId)
        toast.error(data?.message || data?.error || "Erro ao atualizar produto")
        return
      }

      // Atualiza localmente (rápido e responsivo)
      setProducts(prev =>
        prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      )

      toast.dismiss(loadingId)
      toast.success("Produto atualizado com sucesso ✅")
    } catch (error) {
      console.error(error)
      toast.dismiss(loadingId)
      toast.error("Erro ao atualizar produto")
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        updateProduct,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProducts must be used inside ProductProvider")
  return context
}
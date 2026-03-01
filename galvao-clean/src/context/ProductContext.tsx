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

  // 🔥 Função global para tratar token inválido
  function handleUnauthorized() {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

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

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      const newProduct = await response.json()

      if (!response.ok) {
        alert("Erro ao criar produto")
        return
      }

      alert("Produto criado com sucesso ✅")
      setProducts(prev => [...prev, newProduct])

    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
    }
  }

  // 🔥 Deletar produto
  async function removeProduct(id: number) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (!response.ok) {
        alert("Erro ao remover produto")
        return
      }

      alert("Produto removido com sucesso ✅")
      setProducts(prev => prev.filter(p => p.id !== id))

    } catch (error) {
      console.error("Erro ao remover produto:", error)
    }
  }

  // 🔥 Atualizar produto
  async function updateProduct(updatedProduct: Product) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (!response.ok) {
        alert("Erro ao atualizar produto")
        return
      }

      alert("Produto atualizado com sucesso ✅")

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
    <ProductContext.Provider
      value={{ products, addProduct, removeProduct, updateProduct }}
    >
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
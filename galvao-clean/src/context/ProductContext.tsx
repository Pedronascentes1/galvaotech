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

export function ProductProvider({ children }: { children: ReactNode }) {

  const [products, setProducts] = useState<Product[]>([])

  // 🔥 Buscar produtos do backend
  useEffect(() => {
    fetch("https://galvaotech.onrender.com")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Erro ao buscar produtos:", err))
  }, [])

  // 🔥 Criar produto via API
  async function addProduct(product: Omit<Product, "id">) {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch("https://galvaotech.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro do servidor:", errorData)
      alert("Erro ao criar produto. Faça login novamente.")
      return
    }

    const newProduct = await response.json()

    setProducts(prev => [...prev, newProduct])

  } catch (error) {
    console.error("Erro ao adicionar produto:", error)
  }
}



  // 🔥 Deletar produto via API
  async function removeProduct(id: number) {
  try {
    const token = localStorage.getItem("token")

    await fetch(`https://galvaotech.onrender.com/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    setProducts(prev => prev.filter(product => product.id !== id))
  } catch (error) {
    console.error("Erro ao remover produto:", error)
  }
}


  // 🔥 Atualizar produto via API (vamos implementar no backend depois)
  async function updateProduct(updatedProduct: Product) {
    try {
      const token = localStorage.getItem("token")
      await fetch(`https://galvaotech.onrender.com/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
}
,
        body: JSON.stringify(updatedProduct)
      })

      setProducts(prev =>
        prev.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
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

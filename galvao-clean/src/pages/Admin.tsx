import { useState } from "react"
import { useProducts } from "../context/ProductContext"
import BackButton from "../components/BackButton"

export default function Admin() {

  const { products, addProduct, removeProduct, updateProduct } = useProducts()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Lacrado",
    price: "",
    discountPrice: "",
    image: ""
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
  }

  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("https://galvaotech.onrender.com/upload", {
      method: "POST",
      body: formData
    })

    if (!response.ok) {
      throw new Error("Erro ao enviar imagem")
    }

    const data = await response.json()
    return data.url
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name || !form.price) return

    let imageUrl = form.image

    try {
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      const productData = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        image: imageUrl
      }

      if (editingId) {
        updateProduct({ id: editingId, ...productData })
        setEditingId(null)
      } else {
        addProduct(productData as any)
      }

      setForm({
        name: "",
        description: "",
        category: "Lacrado",
        price: "",
        discountPrice: "",
        image: ""
      })

      setSelectedFile(null)

    } catch (error) {
      console.error(error)
      alert("Erro ao enviar imagem.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <BackButton />

      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-8">
          Gerenciar Produtos
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
        >

          <input
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Lacrado</option>
            <option>Seminovo</option>
            <option>iPad</option>
            <option>Apple Watch</option>
            <option>Acessórios</option>
          </select>

          <input
            name="price"
            placeholder="Preço normal"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="discountPrice"
            placeholder="Preço com desconto (opcional)"
            value={form.discountPrice}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {editingId ? "Atualizar Produto" : "Adicionar Produto"}
          </button>

        </form>

        <div className="space-y-6">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow flex justify-between"
            >
              <div>

                <h2 className="font-semibold text-lg">
                  {product.name}
                </h2>

                <p className="text-gray-500">
                  {product.description}
                </p>

                {product.discountPrice ? (
                  <>
                    <p className="text-gray-400 line-through text-sm">
                      R$ {product.price.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-green-600 font-bold text-lg">
                      R$ {product.discountPrice.toLocaleString("pt-BR")}
                    </p>
                  </>
                ) : (
                  <p className="text-blue-600 font-bold text-lg">
                    R$ {product.price.toLocaleString("pt-BR")}
                  </p>
                )}

                <p className="text-sm text-gray-400 mt-1">
                  {product.category}
                </p>

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 mt-2 rounded"
                  />
                )}

              </div>

              <div className="flex gap-4 items-start">

                <button
                  onClick={() => {
                    setEditingId(product.id)
                    setForm({
                      name: product.name,
                      description: product.description,
                      category: product.category,
                      price: product.price.toString(),
                      discountPrice: product.discountPrice
                        ? product.discountPrice.toString()
                        : "",
                      image: product.image
                    })
                  }}
                  className="text-blue-600"
                >
                  ✏
                </button>

                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-red-600"
                >
                  🗑
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
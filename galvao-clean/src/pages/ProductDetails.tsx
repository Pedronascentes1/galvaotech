import { useParams } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { useState } from "react"
import Footer from "../components/Footer"

export default function ProductDetails() {

  const { id } = useParams()
  const { products } = useProducts()

  const product = products.find(p => p.id === Number(id))

  const [installments, setInstallments] = useState(1)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Produto não encontrado.</p>
      </div>
    )
  }

  const price = product.discountPrice || product.price

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  function handleWhatsApp() {
    const phoneNumber = "5534999126661"

    const message =
      `Olá, tenho interesse no produto:\n\n` +
      `${product!.name}\n` +
      `Preço: ${formatCurrency(price)}\n` +
      `Parcelamento: ${installments}x de ${formatCurrency(price / installments)}`

    const encodedMessage = encodeURIComponent(message)

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* IMAGEM */}
        <div className="bg-gray-50 rounded-3xl p-10 flex items-center justify-center shadow-lg">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[450px] object-contain"
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className="space-y-8">

          <span className="text-sm bg-blue-100 text-blue-600 px-4 py-1 rounded-full">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* PREÇO */}
          <div className="space-y-2">
            {product.discountPrice && (
              <p className="text-gray-400 line-through text-lg">
                {formatCurrency(product.price)}
              </p>
            )}

            <p className="text-4xl font-bold text-blue-600">
              {formatCurrency(price)}
            </p>
          </div>

          {/* PARCELAMENTO */}
          <div>
            <p className="text-sm mb-2 text-gray-600">
              Parcelar em até 18x:
            </p>

            <select
              value={installments}
              onChange={(e) =>
                setInstallments(Number(e.target.value))
              }
              className="w-full border border-gray-200 p-3 rounded-xl"
            >
              {[...Array(18)].map((_, i) => {
                const parcela = price / (i + 1)
                return (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}x de {formatCurrency(parcela)}
                  </option>
                )
              })}
            </select>
          </div>

          {/* BOTÃO WHATSAPP */}
          <button
            onClick={handleWhatsApp}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition"
          >
            Comprar via WhatsApp
          </button>

        </div>
      </div>

      <Footer />
    </div>
  )
}
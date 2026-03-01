import { useParams, useNavigate } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import { useCart } from "../context/CartContext"
import Footer from "../components/Footer"

export default function ProductDetails() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addToCart } = useCart()

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Produto não encontrado.
        </p>
      </div>
    )
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  function handleAddToCart() {
    addToCart(product!)
    navigate("/carrinho")
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
              {formatCurrency(product.discountPrice || product.price)}
            </p>
          </div>

          {/* BOTÃO */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition"
          >
            Adicionar ao Carrinho
          </button>

        </div>
      </div>

      <Footer />
    </div>
  )
}
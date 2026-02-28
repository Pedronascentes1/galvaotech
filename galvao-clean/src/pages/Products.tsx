import { Link } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import ProductCard from "../components/ProductCard"
import { useCart } from "../context/CartContext"
import { useState, useRef, useEffect } from "react"
import Footer from "../components/Footer"
import logo from "../assets/logo.png"

export default function Products() {

  const { products } = useProducts()
  const { cart, removeFromCart } = useCart()

  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [openCart, setOpenCart] = useState(false)
  const [animateCount, setAnimateCount] = useState(false)

  const cartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (cart.length > 0) {
      setAnimateCount(true)
      const timer = setTimeout(() => setAnimateCount(false), 300)
      return () => clearTimeout(timer)
    }
  }, [cart.length])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setOpenCart(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const categories = [
    "Todos",
    "Lacrado",
    "Seminovo",
    "iPad",
    "Apple Watch",
    "Acessórios"
  ]

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter(p => p.category === selectedCategory)
function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}
  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">

    {/* LOGO */}
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Galvão Tech"
        className="h-9 sm:h-10 w-auto object-contain"
      />
    </div>

    {/* MENU */}
    <div className="flex items-center gap-6 text-gray-600 font-medium">

      <Link to="/" className="hover:text-black transition">
        Home
      </Link>

      {/* CARRINHO */}
      <div className="relative">
        <button
          onClick={() => setOpenCart(true)}
          className="hover:text-black transition"
        >
          Carrinho{" "}
          <span
            className={`inline-block bg-black text-white text-xs px-2 py-1 rounded-full ml-1 transition-transform ${
              animateCount ? "scale-125" : "scale-100"
            }`}
          >
            {cart.length}
          </span>
        </button>
      </div>

      <Link to="/admin" className="hover:text-black transition">
        Admin
      </Link>
    </div>
  </div>

  {/* ========================= */}
  {/* DRAWER DO CARRINHO */}
  {/* ========================= */}

  {openCart && (
    <div className="fixed inset-0 z-50">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpenCart(false)}
      />

      {/* Drawer */}
      <div
        className="
          absolute right-0 top-0
          w-full sm:w-96
          h-full
          bg-white
          shadow-2xl
          p-6
          overflow-y-auto
          transition-transform duration-300
        "
      >
        <h3 className="font-semibold text-lg mb-4 text-gray-900">
          Seu Carrinho
        </h3>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Seu carrinho está vazio.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(Number(item.price))}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 text-xs hover:text-red-700 ml-3"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>
                {formatCurrency(
                  cart.reduce((sum, item) => sum + Number(item.price), 0)
                )}
              </span>
            </div>
          </>
        )}

        <Link
          to="/carrinho"
          className="block mt-6 bg-black text-white text-center py-3 rounded-full hover:bg-gray-800 transition"
          onClick={() => setOpenCart(false)}
        >
          Ver Carrinho Completo
        </Link>
      </div>
    </div>
  )}
</nav>

      {/* CONTEÚDO */}
      <div className="border-2 sm:border-3 border-blue-500 rounded-3xl p-6 sm:p-10 flex justify-center">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-gray-900">
            Nossos Produtos
          </h1>

          {/* FILTRO */}
          <div className="flex flex-wrap gap-4 mb-16">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* PRODUTOS */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              Nenhum produto encontrado nessa categoria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard
  key={product.id}
  name={product.name}
  description={product.description}
  category={product.category}
  price={product.price}
  discountPrice={product.discountPrice}
  image={product.image}
/>

              ))}
            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}

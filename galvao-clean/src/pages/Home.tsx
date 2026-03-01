import { Link } from "react-router-dom"
import { useProducts } from "../context/ProductContext"
import ProductCard from "../components/ProductCard"
import { useCart } from "../context/CartContext"
import { useState, useRef, useEffect } from "react"
import logo from "../assets/logo.png"
import Footer from "../components/Footer"







export default function Home() {
    const { cart, removeFromCart } = useCart()
    const [animateCount, setAnimateCount] = useState(false)
    const productsRef = useRef<HTMLDivElement | null>(null)
    const { products } = useProducts()


    const [openCart, setOpenCart] = useState(false)
    const cartRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
  if (cart.length > 0) {
    setAnimateCount(true)

    const timer = setTimeout(() => {
      setAnimateCount(false)
    }, 300)

    return () => clearTimeout(timer)
  }
}, [cart.length])
    
    useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      cartRef.current &&
      !cartRef.current.contains(event.target as Node)
    ) {
      setOpenCart(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [])


function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}
  return (
    <div className="bg-white min-h-screen">

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

      <Link to="/produtos" className="hover:text-black transition">
        Produtos
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


      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-32">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

    <div>
     <h1 className="text-4xl sm:text-6xl font-bold mb-6">
        Tecnologia Apple de
        <span className="block text-blue-500">
          Qualidade Premium
        </span>
      </h1>

      <p className="text-gray-300 mb-8">
        Produtos originais com garantia.
        Pronta entrega e encomenda disponível.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/produtos"
          className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Ver Catálogo
        </Link>

        <button className="border border-white px-6 py-3 rounded-lg">
          Saiba Mais
        </button>
      </div>
    </div>

    <div className="border-2 sm:border-3 border-blue-500 rounded-3xl p-6 sm:p-10 flex justify-center">
      <img
  src={logo}
  alt="Galvão Tech"
  className="w-56 object-contain drop-shadow-2xl"
/>

    </div>

  </div>
</section>
<section className="bg-gray-50 py-20 border-t border-gray-200">
  <div className="max-w-6xl mx-auto px-6">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

      {/* ITEM 1 */}
      <div className="space-y-2">
        <h3 className="text-5xl font-bold text-blue-600">
          5000+
        </h3>
        <p className="text-gray-600 text-lg">
          Clientes Satisfeitos
        </p>
      </div>

      {/* ITEM 2 */}
      <div className="space-y-2">
        <h3 className="text-5xl font-bold text-blue-600">
          100%
        </h3>
        <p className="text-gray-600 text-lg">
          Produtos Originais
        </p>
      </div>

      {/* ITEM 3 */}
      <div className="space-y-2">
        <h3 className="text-5xl font-bold text-blue-600">
          24h
        </h3>
        <p className="text-gray-600 text-lg">
          Suporte ao Cliente
        </p>
      </div>

    </div>

  </div>
</section>
<section className="bg-gray-50 py-24">
  <div className="max-w-7xl mx-auto px-6">

    {/* TÍTULO */}
    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
      Por Que Escolher Galvão Tech?
    </h2>

    {/* CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* CARD 1 */}
      <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-3-3-3-3-3s0 3-3 3m6 0c0-3 3-3 3-3s0 3 3 3m-6 0v10m0-10H9m3 0h3"/>
          </svg>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          Garantia de 6 Meses
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Todos os produtos seminovos possuem garantia completa de 6 meses com cobertura total.
        </p>
      </div>

      {/* CARD 2 */}
      <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 0l-4 4m4-4l4 4m6 6V7m0 0l-4 4m4-4l4 4"/>
          </svg>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          Entrega Rápida
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Pronta entrega em estoque ou encomenda em 3 a 7 dias úteis. Temos todos os modelos de iPhones.
        </p>
      </div>

      {/* CARD 3 */}
      <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l3 7-1 2h11"/>
          </svg>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          Suporte Dedicado
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Atendimento personalizado via WhatsApp. Tire suas dúvidas e finalize sua compra com facilidade.
        </p>
      </div>

    </div>

  </div>
</section>


         {/* Produtos */}
<section
  ref={productsRef}
  className="py-24 bg-gray-50"
>

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
      Produtos em Destaque
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {products.map(product => (
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

  </div>
</section>
      <Footer/>
    </div>
    
  )
}



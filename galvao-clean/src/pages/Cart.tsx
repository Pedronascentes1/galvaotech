import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Cart() {

  const { cart, removeFromCart } = useCart()

  const [paymentMethod, setPaymentMethod] = useState("Pix")
  const [installments, setInstallments] = useState(1)

  // 🔥 Garantir que sempre seja número
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  )

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  function handleWhatsApp() {

    if (cart.length === 0) return

    const phoneNumber = "5534999126661"

    const productList = cart
      .map(item =>
        `- ${item.name} | R$ ${formatCurrency(Number(item.price))}`
      )
      .join("\n")

    let message =
      `Olá, quero finalizar a compra:\n\n` +
      `${productList}\n\n` +
      `Total: R$ ${formatCurrency(total)}\n` +
      `Pagamento: ${paymentMethod}`

    if (paymentMethod === "Crédito") {
      message +=
        `\nParcelamento: ${installments}x de R$ ${formatCurrency(total / installments)}`
    }

    const encodedMessage = encodeURIComponent(message)

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">

        {/* ESQUERDA */}
        <div className="col-span-2 space-y-6">

          <h1 className="text-3xl font-bold text-gray-900">
            Seu Carrinho
          </h1>

          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {item.name}
                </h2>

                <p className="text-blue-600 font-bold">
                  R$ {formatCurrency(Number(item.price))}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700"
              >
                🗑
              </button>
            </div>
          ))}

        </div>

        {/* DIREITA */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">

          <h2 className="text-xl font-bold">
            Forma de Pagamento
          </h2>

          {/* PIX */}
          <div
            onClick={() => setPaymentMethod("Pix")}
            className={`border p-4 rounded-xl cursor-pointer transition ${
              paymentMethod === "Pix"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <p className="font-semibold">PIX</p>
            <span className="text-sm text-gray-500">
              Pagamento instantâneo
            </span>
          </div>

          {/* CRÉDITO */}
          <div
            onClick={() => setPaymentMethod("Crédito")}
            className={`border p-4 rounded-xl cursor-pointer transition ${
              paymentMethod === "Crédito"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <p className="font-semibold">Cartão de Crédito</p>
            <span className="text-sm text-gray-500">
              Até 18x
            </span>
          </div>

          {/* DINHEIRO */}
          <div
            onClick={() => setPaymentMethod("Dinheiro")}
            className={`border p-4 rounded-xl cursor-pointer transition ${
              paymentMethod === "Dinheiro"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <p className="font-semibold">Dinheiro</p>
            <span className="text-sm text-gray-500">
              Pagamento na entrega
            </span>
          </div>

          {/* Parcelamento */}
          {paymentMethod === "Crédito" && (
            <div>
              <p className="text-sm mb-2">
                Parcelar em quantas vezes?
              </p>

              <select
                value={installments}
                onChange={(e) =>
                  setInstallments(Number(e.target.value))
                }
                className="w-full border p-2 rounded"
              >
                {[...Array(18)].map((_, i) => {
                  const parcela = total / (i + 1)

                  return (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}x de R$ {formatCurrency(parcela)}
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {/* RESUMO */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {formatCurrency(total)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span className="text-blue-600">
                R$ {formatCurrency(total)}
              </span>
            </div>
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Finalizar no WhatsApp
          </button>

          <Link
            to="/"
            className="block text-center text-gray-500 text-sm hover:underline"
          >
            Continuar Comprando
          </Link>

        </div>

      </div>
    </div>
  )
}

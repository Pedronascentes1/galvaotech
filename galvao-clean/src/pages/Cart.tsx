import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"
import { useState } from "react"

type Bandeira = "visa_master" | "outras"

function calcAntecipacaoRate(parcelas: number, am: number) {
  if (parcelas <= 1) return 0

  // PV = soma das parcelas descontadas mês a mês
  const pv = Array.from({ length: parcelas }, (_, i) => {
    const k = i + 1
    return (1 / parcelas) / Math.pow(1 + am, k)
  }).reduce((a, b) => a + b, 0)

  // taxa = 1 - PV
  return 1 - pv
}

function getMdrRate(parcelas: number, bandeira: Bandeira) {
  // conforme sua planilha:
  // Visa/Master: 1x=3.3% | 2-6=2.7% | 7-18=2.8%
  // Outras:      1x=4.21% | 2-6=3.17% | 7-18=3.53%
  if (bandeira === "visa_master") {
    if (parcelas === 1) return 0.033
    if (parcelas <= 6) return 0.027
    return 0.028
  } else {
    if (parcelas === 1) return 0.0421
    if (parcelas <= 6) return 0.0317
    return 0.0353
  }
}

function getAntecipacaoAM(bandeira: Bandeira) {
  // conforme sua planilha:
  // Visa/Master: 1.98% a.m.
  // Outras:      1.39% a.m.
  return bandeira === "visa_master" ? 0.0198 : 0.0139
}

function calcCreditoComEntrada(params: {
  total: number
  entrada: number
  parcelas: number
  bandeira: Bandeira
}) {
  const { total, entrada, parcelas, bandeira } = params

  const entradaUsada = Math.max(0, Math.min(entrada, total))
  const liquidoDesejadoNoCartao = Math.max(0, total - entradaUsada)

  const mdr = getMdrRate(parcelas, bandeira)
  const am = getAntecipacaoAM(bandeira)
  const ant = calcAntecipacaoRate(parcelas, am)

  const taxaTotal = mdr + ant
  const fator = 1 / (1 - taxaTotal) // fator real (tipo o da planilha)

  const brutoNoCartao = liquidoDesejadoNoCartao * fator
  const valorParcela = parcelas > 0 ? brutoNoCartao / parcelas : 0

  return {
    entradaUsada,
    liquidoDesejadoNoCartao,
    brutoNoCartao,
    valorParcela,
    mdr,
    ant,
    taxaTotal,
    fator
  }
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function Cart() {

  const { cart, removeFromCart } = useCart()

  const [paymentMethod, setPaymentMethod] = useState("Pix")
  const [installments, setInstallments] = useState(1)
  const [downPayment, setDownPayment] = useState("") // entrada digitada
  const [bandeira, setBandeira] = useState<Bandeira>("visa_master")

  // 🔥 Garantir que sempre seja número
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0)

  const entradaNum = Number(downPayment || 0)

const sim = calcCreditoComEntrada({
  total,
  entrada: entradaNum,
  parcelas: installments,
  bandeira
})

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
  message += `\nEntrada: ${formatBRL(sim.entradaUsada)}`
  message += `\nNo cartão: ${installments}x de ${formatBRL(sim.valorParcela)}`
  message += `\nTotal no cartão: ${formatBRL(sim.brutoNoCartao)}`
}

    const encodedMessage = encodeURIComponent(message)

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ESQUERDA */}
        <div className="lg:col-span-2 space-y-6">

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
              <div className="space-y-3">
  <div>
    <p className="text-sm mb-2">Entrada (opcional)</p>
    <input
      value={downPayment}
      onChange={(e) => setDownPayment(e.target.value)}
      placeholder="Ex: 500"
      inputMode="numeric"
      className="w-full border p-2 rounded"
    />
    <p className="text-xs text-gray-500 mt-1">
      Restante será parcelado no cartão.
    </p>
  </div>

  <div>
    <p className="text-sm mb-2">Bandeira do cartão</p>
    <select
      value={bandeira}
      onChange={(e) => setBandeira(e.target.value as Bandeira)}
      className="w-full border p-2 rounded"
    >
      <option value="visa_master">Visa / Master</option>
      <option value="outras">Outras</option>
    </select>
  </div>
</div>
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
          <div className="border-t pt-4 space-y-2">
  <div className="flex justify-between text-gray-600">
    <span>Total do carrinho</span>
    <span>{formatBRL(total)}</span>
  </div>

  {paymentMethod === "Crédito" && (
    <>
      <div className="flex justify-between text-gray-600">
        <span>Entrada</span>
        <span>{formatBRL(sim.entradaUsada)}</span>
      </div>

      <div className="flex justify-between font-bold text-lg">
        <span>No cartão ({installments}x)</span>
        <span className="text-blue-600">{formatBRL(sim.brutoNoCartao)}</span>
      </div>

      <div className="text-sm text-gray-500">
        {installments}x de {formatBRL(sim.valorParcela)}
      </div>
    </>
  )}
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

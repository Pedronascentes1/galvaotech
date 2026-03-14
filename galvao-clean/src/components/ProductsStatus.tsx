type Props = {
  availability: "pronta_entrega" | "encomenda"
}

export default function ProductStatus({ availability }: Props) {

  const isReady = availability === "pronta_entrega"

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        isReady
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {isReady ? "Pronta Entrega" : "Encomenda"}
    </span>
  )
}
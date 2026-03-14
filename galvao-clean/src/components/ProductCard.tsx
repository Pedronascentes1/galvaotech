import { Link } from "react-router-dom"

type Props = {
  id: number
  name: string
  description: string
  category: string
  price: number
  discountPrice?: number
  image: string
  availability: "pronta_entrega" | "encomenda"
}

export default function ProductCard({
  id,
  name,
  description,
  category,
  price,
  discountPrice,
  image,
  availability
}: Props) {

  return (
    <Link to={`/produto/${id}`}>
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">

        <img
          src={image}
          alt={name}
          className="w-full aspect-square object-contain rounded-xl mb-4 bg-gray-100 p-4"
        />

        {/* CATEGORIA + STATUS */}
        <div className="flex items-center justify-between mb-2">

          {category && (
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              {category}
            </span>
          )}

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              availability === "pronta_entrega"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {availability === "pronta_entrega"
              ? "Pronta Entrega"
              : "Encomenda"}
          </span>

        </div>

        <h3 className="text-lg font-semibold mt-3 mb-2">
          {name}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {description}
        </p>

        {/* PREÇO */}
        <div className="mb-4">

          {discountPrice && discountPrice > 0 ? (
            <>
              <p className="text-sm text-gray-400 line-through">
                R$ {price.toLocaleString("pt-BR")}
              </p>

              <p className="text-xl font-bold text-green-600">
                R$ {discountPrice.toLocaleString("pt-BR")}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-green-600">
              R$ {price.toLocaleString("pt-BR")}
            </p>
          )}

        </div>

        <div className="bg-black text-white py-2 rounded-lg text-center">
          Ver Produto
        </div>

      </div>
    </Link>
  )
}
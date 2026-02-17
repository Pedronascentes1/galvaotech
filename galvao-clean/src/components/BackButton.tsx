import { useNavigate } from "react-router-dom"

export default function BackButton() {
  const navigate = useNavigate()

  return (
  <button
    onClick={() => navigate(-1)}
    className="mb-6 flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition"
  >
    <span className="text-lg">←</span>
    <span className="font-medium">Voltar</span>
  </button>
)

}

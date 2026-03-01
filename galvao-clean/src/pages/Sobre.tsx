import { useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import logo from "../assets/logo.png"

export default function Sobre() {

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState([
    { stars: 5, text: "Atendimento excelente e produto original!" },
    { stars: 5, text: "Entrega rápida e garantia real. Recomendo!" }
  ])

  function handleSubmitReview() {
    if (rating === 0 || comment.trim() === "") return

    setReviews([...reviews, { stars: rating, text: comment }])
    setRating(0)
    setComment("")
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">

      {/* HERO */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-24 px-6 text-center">
        <img src={logo} alt="Galvaltake" className="h-16 mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Sobre a Galvatech
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
          Tecnologia premium, confiança e atendimento personalizado.
          Conectamos você ao melhor da Apple com segurança e transparência.
        </p>
      </section>

      {/* HISTÓRIA */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossa História
        </h2>

        <p className="text-gray-600 leading-relaxed text-center max-w-4xl mx-auto text-lg">
          A Galvaltech nasceu com o propósito de oferecer tecnologia de alta qualidade,
          produtos originais e garantia real. Nosso foco sempre foi entregar confiança,
          atendimento rápido via WhatsApp e uma experiência moderna para nossos clientes.
          Trabalhamos com produtos lacrados e seminovos, sempre prezando por transparência
          e excelência.
        </p>
      </section>

      {/* MISSÃO VISÃO */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-4">Missão</h3>
            <p className="text-gray-600">
              Oferecer tecnologia premium com preços acessíveis e atendimento personalizado.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-4">Visão</h3>
            <p className="text-gray-600">
              Ser referência regional em produtos Apple e atendimento digital.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-4">Valores</h3>
            <p className="text-gray-600">
              Transparência, confiança, qualidade e inovação constante.
            </p>
          </div>

        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Nossa Localização
        </h2>

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Localização"
            src="https://www.google.com/maps?q=Patos%20de%20Minas%20MG&output=embed"
            width="100%"
            height="350"
            className="border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Atendimento presencial mediante agendamento.
        </p>
      </section>

      {/* AVALIAÇÕES */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-12">
            Avaliações de Clientes
          </h2>

          {/* Lista de avaliações */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow">
                <div className="text-yellow-500 mb-2">
                  {"★".repeat(review.stars)}
                  {"☆".repeat(5 - review.stars)}
                </div>
                <p className="text-gray-600">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Formulário */}
          <div className="bg-white p-8 rounded-2xl shadow max-w-xl mx-auto">

            <h3 className="text-xl font-semibold mb-4 text-center">
              Deixe sua avaliação
            </h3>

            <div className="flex justify-center gap-2 mb-4">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva sua experiência..."
              className="w-full border rounded-lg p-3 mb-4"
            />

            <button
              onClick={handleSubmitReview}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Enviar Avaliação
            </button>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
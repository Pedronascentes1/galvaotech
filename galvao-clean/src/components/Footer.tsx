import logo from "../assets/logo.png"
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        
        <div>
          <img
  src={logo}
  alt="Galvão Tech"
   className="h-10 w-auto object-contain"
/>
          <p className="text-gray-400">
            Sua loja de confiança para produtos Apple premium.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Navegação</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Produtos</li>
            <li>Carrinho</li>
            <li>Admin</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Informações</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Garantia de 6 meses</li>
            <li>Produtos 100% originais</li>
            <li>Entrega rápida</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contato</h4>
          <p className="text-gray-400">WhatsApp: (34) 99930-0318</p>
          <p className="text-gray-400">Atendimento 24h</p>
        </div>

      </div>

      <div className="text-center text-gray-500 mt-12 border-t border-gray-800 pt-6">
        © 2025 Galvão Tech. Todos os direitos reservados.
      </div>
    </footer>
  )
}

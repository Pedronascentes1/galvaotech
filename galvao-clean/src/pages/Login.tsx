import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        alert("Credenciais inválidas")
        return
      }

      const data = await response.json()

      localStorage.setItem("token", data.token)

      navigate("/admin")

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">

        <h2 className="text-2xl font-bold text-center">Login Admin</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Entrar
        </button>

      </form>
    </div>
  )
}

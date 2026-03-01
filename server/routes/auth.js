const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const db = require("../config/db")
const { SECRET } = require("../config/jwt")

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body

  try {
    console.log("===== LOGIN REQUEST =====")
    console.log("Email recebido:", email)

    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    console.log("Usuários encontrados:", results.length)

    if (results.length === 0) {
      console.log("❌ Email não encontrado no banco")
      return res.status(401).json({ message: "Credenciais inválidas - email" })
    }

    const user = results[0]

    console.log("Hash no banco:", user.password)

    const passwordMatch = await bcrypt.compare(password, user.password)

    console.log("Password match:", passwordMatch)

    if (!passwordMatch) {
      console.log("❌ Senha não confere")
      return res.status(401).json({ message: "Credenciais inválidas - senha" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    )

    console.log("✅ Login bem sucedido")
    res.json({ token })

  } catch (error) {
    console.error("🔥 ERRO NO LOGIN:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

module.exports = router
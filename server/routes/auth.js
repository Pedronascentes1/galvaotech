const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const db = require("../config/db")
const { SECRET } = require("../config/jwt")

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    const user = results[0]

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    )

    res.json({ token })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

module.exports = router

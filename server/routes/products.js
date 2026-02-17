const express = require("express")
const router = express.Router()
const db = require("../config/db")
const authMiddleware = require("../middleware/auth")

// 🔥 LISTAR PRODUTOS
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products")
    res.json(rows)
  } catch (error) {
    console.error("ERRO AO LISTAR:", error)
    res.status(500).json({ error: error.message })
  }
})

// 🔥 CRIAR PRODUTO (PROTEGIDO)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, image } = req.body

    const [result] = await db.query(
      "INSERT INTO products (name, description, category, price, discountPrice, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, category, price, discountPrice || null, image]
    )

    res.json({
      id: result.insertId,
      name,
      description,
      category,
      price,
      discountPrice,
      image
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})


// 🔥 ATUALIZAR
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, image } = req.body
    const { id } = req.params

    await db.query(
      "UPDATE products SET name=?, description=?, category=?, price=?, discountPrice=?, image=? WHERE id=?",
      [name, description, category, price, discountPrice || null, image, id]
    )

    res.json({ message: "Produto atualizado" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})


// 🔥 DELETAR
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.query(
      "DELETE FROM products WHERE id=?",
      [id]
    )

    console.log("Linhas deletadas:", result.affectedRows)

    res.json({ message: "Produto removido" })

  } catch (error) {
    console.error("ERRO AO DELETAR:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

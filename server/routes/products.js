const express = require("express")
const router = express.Router()

const db = require("../config/db")
const authMiddleware = require("../middleware/auth")

// LISTAR (público)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products")
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao listar produtos" })
  }
})

// CRIAR (protegido)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, image } = req.body

    const [result] = await db.query(
      `INSERT INTO products (name, description, category, price, discountPrice, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, price, discountPrice ?? null, image]
    )

    res.json({
      id: result.insertId,
      name,
      description,
      category,
      price,
      discountPrice: discountPrice ?? null,
      image
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao criar produto" })
  }
})

// ATUALIZAR (protegido)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, category, price, discountPrice, image } = req.body

    await db.query(
      `UPDATE products
       SET name=?, description=?, category=?, price=?, discountPrice=?, image=?
       WHERE id=?`,
      [name, description, category, price, discountPrice ?? null, image, id]
    )

    res.json({ message: "Produto atualizado" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao atualizar produto" })
  }
})

// DELETAR (protegido)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    await db.query("DELETE FROM products WHERE id=?", [id])
    res.json({ message: "Produto removido" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao deletar produto" })
  }
})

module.exports = router
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const productsRoutes = require("./routes/products")
app.use("/products", productsRoutes)

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001")
})
const authRoutes = require("./routes/auth")
app.use("/auth", authRoutes)

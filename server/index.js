require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()

// ✅ CORS: permite seu front (Vercel) e também localhost pra testes
const allowedOrigins = [
  "https://galvaotech.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]

app.use(cors({
  origin: [
    "https://galvaotech.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json())

// ✅ Rotas
const productsRoutes = require("./routes/products")
const authRoutes = require("./routes/auth")

app.use("/products", productsRoutes)
app.use("/auth", authRoutes)

// ✅ Rota raiz pra Render não mostrar "Cannot GET /"
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API GalvãoTech online 🚀" })
})

// ✅ Healthcheck (bom pra testar banco e API)
app.get("/health", (req, res) => {
  res.json({ ok: true })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT)
})

const rateLimit = require("express-rate-limit")

console.log("DATABASE_URL ATUAL:", process.env.DATABASE_URL)
const uploadRoutes = require("./routes/upload")
app.use("/upload", uploadRoutes)
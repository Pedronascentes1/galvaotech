const mysql = require("mysql2/promise")

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida no ambiente.")
}

// ✅ mysql2/promise aceita URL no formato:
// mysql://user:pass@host:port/database
const db = mysql.createPool(process.env.DATABASE_URL)

module.exports = db
const express = require("express")
const multer = require("multer")
const cloudinary = require("../config/cloudinary")

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." })
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "produtos" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Erro no upload." })
        }

        return res.json({ url: result.secure_url })
      }
    )

    result.end(file.buffer)

  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer upload." })
  }
})

module.exports = router
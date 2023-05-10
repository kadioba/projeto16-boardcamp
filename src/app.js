import express from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

const port = process.env.PORT

app.listen(port, console.log(`Servidor rodando na porta ${port}`))
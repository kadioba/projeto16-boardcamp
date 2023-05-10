import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import router from "./routes/index.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

const port = process.env.PORT

app.listen(port, console.log(`Servidor rodando na porta ${port}`))
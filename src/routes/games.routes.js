import { Router } from "express";
import { getGames, insertGame } from "../controllers/games.controller.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", insertGame)

export default gamesRouter
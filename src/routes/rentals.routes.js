import { Router } from "express";
import { deleteRental, endRental, getRentals, insertRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", insertRental)
rentalsRouter.post("/rentals/:id/return", endRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter
import { Router } from "express";
import { deleteRental, endRental, getRentals, insertRental } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { insertRentalSchema } from "../schemas/rentals.schemas.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(insertRentalSchema), insertRental)
rentalsRouter.post("/rentals/:id/return", endRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter
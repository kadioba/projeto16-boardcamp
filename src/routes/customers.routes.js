import { Router } from "express";
import { getCustomerById, getCustomers, insertCustomer, updateCustomer } from "../controllers/customers.controller.js";

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.post("/customers", insertCustomer)
customersRouter.put("/customers/:id", updateCustomer)

export default customersRouter
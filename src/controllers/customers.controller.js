import { db } from "../database/database.connection.js"

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`
            SELECT * FROM customers;`)
        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getCustomerById(req, res) {
    try {
        const customer = await db.query(`
            SELECT * FROM customers WHERE id=$1;`, [req.params.id])

        if (!customer.rows[0]) return res.sendStatus(404)

        res.send(customer.rows[0])
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function insertCustomer(req, res) {
    const { name, cpf, phone, birthday } = req.body

    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
        console.log(customerExists)
        if (customerExists.rowCount !== 0) return res.sendStatus(409)

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

export async function updateCustomer(req, res) {
    const { name, cpf, phone, birthday } = req.body
    try {
        const user = await db.query(`
            SELECT * FROM customers WHERE cpf=$1;`, [cpf])

        if (!user.rows[0]) return res.sendStatus(404)
        if (user.rows[0].id !== Number(req.params.id)) return res.sendStatus(409)

        await db.query(`
            UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;`, [name, phone, cpf, birthday, req.params.id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err)
    }
}

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
        res.send("Função não implementada")
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function insertCustomer(req, res) {
    const { name, cpf, phone, birthday } = req.body

    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE name=$1`, [cpf])
        if (customerExists.rowCount !== 0) return res.sendStatus(409)

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)`, [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function updateCustomer(req, res) {
    try {
        res.send("Função não implementada")
    } catch (err) {
        res.status(500).send(err)
    }
}
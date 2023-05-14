import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function getRentals(req, res) {
    try {
        res.send("Função não implementada")
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const dateNow = dayjs().format('YYYY-MM-DD')

    if (daysRented <= 0) return res.sendStatus(400)
    console.log(dateNow)

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId])
        if (customer.rowCount === 0) return res.sendStatus(400)

        const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])

        if (game.rowCount === 0) return res.sendStatus(400)
        const originalPrice = game.rows[0].pricePerDay * daysRented

        const gamesRented = await db.query(`SELECT rentals.id FROM rentals
                    WHERE rentals."gameId"=$1 AND rentals."returnDate" IS NULL`, [gameId])

        if (gamesRented.rowCount >= game.rows[0].stockTotal) return res.sendStatus(400)

        const rental = await db.query(`INSERT INTO rentals
                  ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
                    VALUES ($1, $2, $3, $4, NULL, $5, NULL );`, [customerId, gameId, dateNow, daysRented, originalPrice])

        res.status(201).send(rental)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

export async function endRental(req, res) {
    try {
        res.send("Função não implementada")
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function deleteRental(req, res) {
    try {
        res.send("Função não implementada")
    } catch (err) {
        res.status(500).send(err)
    }
}
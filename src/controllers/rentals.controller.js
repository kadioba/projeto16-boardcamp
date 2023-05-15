import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function getRentals(req, res) {

    try {
        const rentals = await db.query(`SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
            FROM rentals JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id`)

        const rentalsOrganized = rentals.rows.map(rental => {
            rental.customer = { id: rental.customerId, name: rental.customerName }
            rental.game = { id: rental.gameId, name: rental.gameName }
            delete rental.gameName
            delete rental.customerName
            return rental
        })
        res.send(rentalsOrganized)

    } catch (err) {
        res.status(500).send(err)
        console.log(err)
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
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [req.params.id]);
        if (!rental.rows[0]) return res.sendStatus(404)
        if (rental.rows[0].returnDate !== null) res.sendStatus(400)

        const dateNow = dayjs().format('YYYY-MM-DD')
        console.log(dateNow)
        console.log(rental.rows[0].rentDate)
        console.log(rental.rows[0].daysRented)


        const umDiaEmMilissegundos = 24 * 60 * 60 * 1000; // Número de milissegundos em um dia
        const dataInicialObj = new Date(rental.rows[0].rentDate);
        const dataFinalObj = new Date(Date.now());
        const dataInicialSemHorario = new Date(dataInicialObj.getFullYear(), dataInicialObj.getMonth(), dataInicialObj.getDate());
        const dataFinalSemHorario = new Date(dataFinalObj.getFullYear(), dataFinalObj.getMonth(), dataFinalObj.getDate());
        const diferencaEmMilissegundos = Math.abs(dataFinalSemHorario - dataInicialSemHorario);
        const diferencaEmDias = Math.round(diferencaEmMilissegundos / umDiaEmMilissegundos);

        const extraDays = diferencaEmDias - rental.rows[0].daysRented;

        let delayFee = null;
        if (extraDays > 0) {
            delayFee = Math.round(extraDays * (rental.rows[0].originalPrice * 2))
        }

        if (delayFee) {
            const updatedRental = await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2  WHERE id = $3;`, [dateNow, delayFee, req.params.id])
            return res.sendStatus(200)
        }
        else {
            const updatedRental = await db.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2;`, [dateNow, req.params.id])
            return res.sendStatus(200)
        }

    } catch (err) {
        res.status(500).send(err)
        console.log(err)
    }
}

export async function deleteRental(req, res) {
    try {
        res.send("Função não implementada")
    } catch (err) {
        res.status(500).send(err)
    }
}
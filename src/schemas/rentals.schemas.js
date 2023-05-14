import joi from 'joi'

export const insertRentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required()
})
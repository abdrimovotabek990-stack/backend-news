export const tagSchema = Joi.object({
    name: Joi.string().min(2).max(30).required()
})

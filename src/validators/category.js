export const categorySchema = Joi.object({
    name: Joi.string().min(2).max(50).description(300).required(),
})


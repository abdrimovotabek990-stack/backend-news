export const createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(50).description(300).required(),
})

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(50).description(300).required(),
})

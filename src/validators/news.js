export const createNewsSchema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(20).required(),
    categoryId: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
})

export const updateNewsSchema = Joi.object({
    title: Joi.string().min(5).max(200),
    description: Joi.string().min(20),
    categoryId: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    removeImages: Joi.array().items(Joi.string()),
}) 


export const rejectNewsSchema = Joi.object({
    reason: Joi.string().min(3).max(300)
}) 

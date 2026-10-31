export const blockUserSchema = Joi.object({
    reason: Joi.string().min(3).max(300)
})




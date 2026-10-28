import Joi from "joi";  


export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
})

export const updateProfilSchema = Joi.object({

})

export const changePasswordSchema = Joi.object({
    
})

export const createNewsSchema = Joi.object({
    
})
export const updateNewsSchema = Joi.object({
    
})
export const newsQuerySchema = Joi.object({
    
})
export const adminNewsQuerySchema = Joi.object({
    
})

export const categorySchema = Joi.object({
    
})

export const tagSchema = Joi.object({
    
})

export const rejactNewsSchema = Joi.object({
    
})
export const blockUserSchema = Joi.object({
    
})

export const ObjectIdSchema = Joi.object({
    
})




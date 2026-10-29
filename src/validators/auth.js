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
    newName: Joi.string().min(2).max(50).required(),
    newEmail: Joi.string().email().required(),
}).or('newName', 'newEmail');

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(8).max(64).required(),
    newPassword: Joi.string().min(8).max(64).required(),
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




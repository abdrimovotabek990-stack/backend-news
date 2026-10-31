import Joi from 'joi';

export const newsQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10),
    q: Joi.string().min(1).max(100),
    category: Joi.string().pattern(slugRegex),
    tag: Joi.string().pattern(slugRegex),
    sort: Joi.string().valid('newest', 'oldest') 
})
export const adminNewsQuerySchema = Joi.object({
    status: Joi.string().valid('PENDING', 'PUBLISHED', 'REJECTED'),
})
import Category from "../models/categories.model.js";
import News from "../models/news.model.js";
import ApiError from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import slugify from 'slugify'


//  CATIGORIYALAR 
export const createCategory = asyncHandler(async (req, res) => {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name: name.trim() });    
        
        if (existingCategory) {
            throw new ApiError(409, "Allaqachon mavjud")
        }


        let slug = slugify(name, { lower: true, strict: true }); 

        const slugExists = await Category.findOne({ slug });
        if (slugExists) {
            const randomNum = Math.random().toString(36).substring(2, 6);
            slug = `${slug}-${randomNum}`;
        }

        
        const category = await Category.create({ name: name.trim(), slug, description: description ? description.trim() : undefined });

        res.status(201).json({
            success: true,
            message: 'Kategoriya yaratildi',
            data: category
        });  
})


export const updateCategory = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            throw new ApiError(404, 'Kategoriya topilmadi');
        }

        const trimmedName = name.trim();
        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({ name: trimmedName, _id: { $ne: id } });   

            if (existingCategory) {
                throw new ApiError(409, 'Ushbu nomdagi kategoriya oldindan mavjud');
            }
        }

        let slug = slugify(trimmedName, { lower: true, strict: true });
        const slugExists = await Category.findOne({ slug, _id: { $ne: id } });
        if (slugExists) {
            const randomNum = Math.random().toString(36).substring(2, 6);
            slug = `${slug}-${randomNum}`;
        }

        category.name = trimmedName;
        category.slug = slug;

        if (description !== undefined) {
            category.description = description ? description.trim() : '';
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Kategoriya yangilandi',
            data: category
        }); 
})


export const deleteCategory = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            throw new ApiError(404, 'Kategoriya topilmadi');
        }

        const newsCount = await News.countDocuments({ category: id });
        if (newsCount > 0) {
            throw new ApiError(400, 'Bu kategoriyada yangiliklar mavjud bo\'lganligi sababli uni o\'chirish mumkin emas');
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Kategoriya o\'chirildi',
            data: category
        });
})
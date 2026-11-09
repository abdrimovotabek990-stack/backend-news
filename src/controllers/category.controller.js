import Category from "../models/categories.model";
import { asyncHandler } from "../utils/asyncHandler.utils";

//  CATIGORIYALAR 
export const createCategory = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ name: name.trim() });

        if (existingCategory) {
            throw new ApiError(409, 'Ushbu nomdagi kategoriya oldindan mavjud');
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
    } catch (error) {
        res.status(500).json({ message: 'Kategoriya yaratishda xatolik yuz berdi' });
    }   
})


export const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            throw new ApiError(404, 'Kategoriya topilmadi');
        }

        if (name && name.trim() !== category.name) {
            const trimmedName = name.trim();
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
    } catch (error) {
        res.status(500).json({ message: 'Kategoriya yangilashda xatolik yuz berdi' });
    }   
})


export const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            throw new ApiError(404, 'Kategoriya topilmadi');
        }

        const newsCount = await News.countDocuments({ category: id });
        if (newsCount > 0) {
            throw new ApiError(400, 'Bu kategoriyada yangiliklar mavjud bo\'lganligi sababli uni o\'chirish mumkin emas');
        }

        await category.remove();

        res.status(200).json({
            success: true,
            message: 'Kategoriya o\'chirildi',
            data: category
        });
    } catch (error) {
        res.status(500).json({ message: 'Kategoriya o\'chirishda xatolik yuz berdi' });
    }
})
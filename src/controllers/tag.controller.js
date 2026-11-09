import Tag from "../models/tags.model.js";
import ApiError from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

//  TAGLAR
export const getTags = asyncHandler(async(req, res) => {
    const tags = await Tag.find().sort({createdAt: -1})

    res.status(200).json({
        success: true,
        message: "Teglar ro'yhati",
        data: tags
    })
})

export const createTags = asyncHandler(async (req, res) => {

        const { name } = req.body;

        const existingTag = await Tag.findOne({ name: name.trim() });
        if (existingTag) {
            throw new ApiError(409, 'Ushbu nomdagi teg oldindan mavjud');
        }

        const tag = await Tag.create({ name: name.trim() });
        res.status(201).json({
            success: true,
            message: 'Teg yaratildi',
            data: tag
        });  
})


export const updateTagsById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        const tag = await Tag.findById(id);
        if (!tag) {
            throw new ApiError(404, 'Teg topilmadi');
        }

        const existingTag = await Tag.findOne({ name: name.trim(), _id: { $ne: id } });
        if (existingTag) {
            throw new ApiError(409, 'Ushbu nomdagi teg oldindan mavjud');
        }

        tag.name = name.trim();
        await tag.save();

        res.status(200).json({
            success: true,
            message: 'Teg yangilandi',
            data: tag
        });  
})


export const deleteTagsById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const tag = await Tag.findById(id);
        if (!tag) {
            throw new ApiError(404, 'Teg topilmadi');
        }

        await tag.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Teg o\'chirildi',
            data: tag
        });
})


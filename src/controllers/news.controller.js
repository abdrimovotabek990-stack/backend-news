import fs from 'fs';
import path from 'path';
import slugify from 'slugify'
import News from '../models/news.model.js'

import { deleteFiles, formatUploadedFiles } from "../services/file.service.js";
import Category from '../models/categories.model.js';
import { parseArrayField, sanitizeDescription, sanitizeTitle,  } from '../utils/sanitize.utils.js';
import ApiError from '../utils/ApiError.utils.js';
import Tag from '../models/tags.model.js';


export const createNews = async (req, res, next) => {
    const uploadImages = req.files || [];
    try {
        const { title, description, category } = req.body;
        const tags = req.body.tags || [];

        const categoryExist = await Category.findById(category);
        if (!categoryExist) {
            throw new ApiError(404, 'Ushbu turdagi kategoriya topilmadi');
        }

        if (tags.length > 10) {
            throw new ApiError(400, "Yangilikka ko'pi bilan 10 ta teg biriktirish mumkin");
        }

        if (uploadImages.length > 10) {
            throw new ApiError(400, '10 ta rasmgacha ruxsat berilgan');
        }

        const cleanTitle = sanitizeTitle(title);
        const cleanDescription = sanitizeDescription(description);

        let slug = slugify(cleanTitle, { lower: true, strict: true });
        const slugExist = await News.findOne({ slug });
        if (slugExist) {
            const randomCodeforSlug = Math.random().toString(36).substring(2, 6);
            slug = `${slug}-${randomCodeforSlug}`;
        }

        const isAdmin = req.user.role === 'ADMIN';
        const status = isAdmin ? 'PUBLISHED' : 'PENDING';
        const publishedAt = isAdmin ? new Date() : undefined;

        const images = formatUploadedFiles(uploadImages);

        const news = await News.create({
            title: cleanTitle,
            description: cleanDescription,
            slug,
            category,
            tags,
            images,
            author: req.user._id,
            status,
            publishedAt
        });

        await news.populate([
            { path: 'author', select: 'name' },
            { path: 'category', select: 'name slug' },
            { path: 'tags', select: 'name slug' }
        ]);

        res.status(201).json({
            success: true,
            message: isAdmin
                ? "Yangilik yaratildi va ommaga e'lon qilindi"
                : 'Yangilik yaratildi va admin tekshiruviga yuborildi',
            data: news
        });
    } catch (error) {
        if (uploadImages.length > 0) {
            await deleteFiles(uploadImages);
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Yangilik yaratishda xatolik yuz berdi'
        });
    }
};


export const updateNews = async (req, res) => {
    const uploadImages = req.files || [];
    try {
        const { id } = req.params;
        const {  title, description, category } = req.body;

        const news = await News.findById(id)
        if (!news) {
            throw new ApiError(404, 'yangilik topilmadi');
        }

        const isAdmin = req.user.role === 'ADMIN'
        const isOwner = news.author.toString() === req.user._id.toString()

        if (!isAdmin && !isOwner) {
            throw new ApiError(403, " Sizda bu yangilikni o'zgartirish uchun huquq yo'q ")
        }

        if (category !== undefined){
            const categoryExist = await Category.findById(category)
            if(!categoryExist) {
                throw new ApiError(404, ' Categoriya topilmadi')
            }
            news.category = category
        }

        if (req.body.tags !== undefined){
            const tags = [...new Set(parseArrayField(req.body.tags))]
            if(tags.length > 10){
                throw new ApiError(400, "Yangilikka ko'pi bilan 10 ta teg birlashtirish mumkin")
            }   
            if(tags.length > 0){
                const existingTagsCount = await Tag.countDocuments({_id:{$in: tags}})
                if(existingTagsCount !== tags.length){
                   throw new ApiError(404, "Tanlangan teglar topilmadi")
             }
            }
            news.tags = tags
            }
            if (title !== undefined){
                news.title = sanitizeTitle(title)   
            }
            if (description !== undefined){
                news.description = sanitizeDescription(description)
            }

            const removeImages = parseArrayField(req.body.removeImages)
            const deleteImagesFromDisk = []

            if(removeImages.length > 0){
                news.images = news.images.filter((img) => {
                    if(removeImages.includes(img.filename)){
                        deleteImagesFromDisk.push(img.filename);
                        return false;
                    }
                    return true;
                })
            }
            const newImages = formatUploadedFiles(uploadImages)
            if(news.images.length + newImages.length > 10){
                throw new ApiError(400, "10 ta rasmgacha yuklay olasz")
            }
            news.images.push(...newImages)

             if (!isAdmin && (news.status === "PUBLISHED" || news.status === "REJECTED")) {
            news.status = "PENDING";
            news.rejectReason = undefined;
            news.reviewedBy = undefined;
            news.reviewedAt = undefined;
            news.publishedAt = undefined;
            }

            await news.save();

            if (deleteImagesFromDisk.length > 0) {
            await deleteFiles(deleteImagesFromDisk);
            }

            await news.populate([
                { path: 'author', select: 'name' },
                { path: 'category', select: 'name slug' },
                { path: 'tags', select: 'name slug' }
            ]);

        res.status(201).json({
            success: true,
            message: isAdmin
                ? "Yangilik yangilandi"
                : "Yangilik o'zgartirildi va admin tekshiruviga yuborildi",
            data: news
        });
    } catch (error) {
        await deleteFiles(uploadImages);
            throw error;
    }
}


export const deleteNews = async (req, res) => {
    try {
        const {id} = req.params

        const news = await News.findById(id)
        if(!news){
            throw new ApiError(404, "Yanfilik topilmadi")
        }

        const isOwner = news.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN";
        if(!isAdmin && !isOwner){
            throw new ApiError(400, "Siz faqat o'zingiz yaratgan yangilikni o'chira olasz")
        }
        const deleteImages = [...news.images];   

        await news.deleteOne()

        if (deleteImages.length >0){
            await deleteFiles(deleteImages)
        }

        res.status(200).json({
            success: true,
            message: "Yangilik o'chirildi"
        })

    } catch (error) {
        throw error
    }
}
 

export const getAllNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangiliklarni olishda xatolik yuz berdi' });
    }
}

export const getNewsBySearch = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni olishda xatolik yuz berdi' });
    }
}

export const getMyNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yaratgan yangiliklaringizni olishda xatolik yuz berdi' });
    }
}

export const getNewsByslug = async (req, res) => {
    try {

    }catch (error) {
        res.status(500).json({ message: 'Yangilikni olishda xatolik yuz berdi' });
    }
}


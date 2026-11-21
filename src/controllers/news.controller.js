import fs from 'fs';
import path from 'path';
import slugify from 'slugify'
import News from '../models/news.model.js'

import { deleteFiles, formatUploadedFiles } from "../services/file.service.js";
import Category from '../models/categories.model.js';
import sanitize from 'sanitize-html'


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
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Yangilik yangilashda xatolik yuz berdi' });
    }
}


export const deleteNews = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni o\'chirishda xatolik yuz berdi' });
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


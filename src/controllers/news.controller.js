import fs from 'fs';
import path from 'path';
import slugify from 'slugify'
import News from '../models/news.model.js'

import { createNewsSchema, updateNewsSchema } from '../validators/news';


export const createNews = async (req, res) => {
    try {
        if(req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = JSON.parse(req.body.tags);
        }   

        
        const { error, value } = createNewsSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({
            success: false,
            message: error.details.map(mess => mess.message)
            });
        }

        ///

        const { title, description, categoryId, tags } = value;
        
        let slug = slugify(title, {lower: true, strict: true})
        const existingNews = await News.findOne({ slug });
        if (existingNews) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`; 
        }

        const status = req.user.role === 'ADMIN' ? 'PUBLISHED' : 'PENDING';

        const images = req.files ? req.files.map(file => ({
            url: `/uploads/news/${file.filename}`,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        })) : [];

        const news = await News.create({
            title,
            description,
            slug,
            categoryId,
            tags,
            author: req.user._id,
            images,
            status,
            ...(status === 'PUBLISHED' && { publishedAt: new Date() })
        })

        res.status(201).json({
            success: true,
            message: 'Yangilik muvaffaqiyatli yaratildi',
            data: news
        });
    } catch (error) {
        res.status(500).json({ message: 'Schema yaratishda xatolik yuz berdi' });
    }
}


export const updateNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        
        if(req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = JSON.parse(req.body.tags);
        }
        if(req.body.removeImages && typeof req.body.removeImages === 'string') {
            req.body.removeImages = JSON.parse(req.body.removeImages);
        }

        const { error, value } = updateNewsSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(mess => mess.message)
            });
        }

        const news = await News.findById(newsId);
        if (!news) {
            return res.status(404).json({ message: 'Yangilik topilmadi' });
        }
        
        const { title, description, categoryId, tags, removeImages } = value;

        if (req.user.role !== 'ADMIN') {
            news.status = 'PENDING';
        }

        if (removeImages && removeImages.length > 0) {
            news.images = news.images.filter(image => {
                if (removeImages.includes(image.filename)) {
                    const filePath = path.join(process.cwd(), 'uploads/news', image.filename); 
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Fayl o'chirishda xatolik yuz berdi:", err); 
                    });
                    return false;
                }
                return true;
            });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `/uploads/news/${file.filename}`,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            }));
            
            news.images.push(...newImages);
            
            if (news.images.length > 10) {
                return res.status(400).json({ success: false, message: 'Yangilikdagi jami rasmlar soni 10 tadan oshishi mumkin emas' });
            }
        }

        if (title) news.title = title;
        if (description) news.description = description;
        if (categoryId) news.category = categoryId;
        if (tags) news.tags = tags;

        await news.save(); 

        res.status(200).json({ 
            success: true,
            message: "Yangilik muvaffaqiyatli yangilandi", 
            data: news 
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Schema yangilashda xatolik yuz berdi' });
    }
}

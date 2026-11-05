import News from "../models/news.model";
import User from "../models/User.model";
import { asyncHandler } from "../utils/asyncHandler.utils";




export const getAdminStats = asyncHandler(async (req, res) => {
    try {
        const [totalUsers, totalNews, pendingNews, publishedNews,rejectedNews] = await Promise.all([
            User.countDocuments(),
            News.countDocuments(),
            News.countDocuments({ status: 'PENDING' }),
            News.countDocuments({ status: 'PUBLISHED' }),
            News.countDocuments({ status: 'REJECTED' })
        ]);
        res.status(200).json({
            success: true,
            message: 'Admin dashboard statistikasi',
            data: {
                totalUsers,
                totalNews,
                pendingNews,
                publishedNews,
                rejectedNews
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Dashboard statistikasini olishda xatolik yuz berdi' });
    }
})

export const getAdminNews = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangiliklarni olishda xatolik yuz berdi' });
    }
})

export const approveNews = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni tasdiqlashda xatolik yuz berdi' });
    }
})

export const rejectNews = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni rad etishda xatolik yuz berdi' });
    }
})


export const getAdminUsers = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik yuz berdi' });
    }
})


export const getAdminUsersNews = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchining yangiliklarini olishda xatolik yuz berdi' });
    }   
})

export const blockUser =asyncHandler (async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini bloklashda xatolik yuz berdi' });
    }   
})

export const unblockUser = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini blokdan chiqarishda xatolik yuz berdi' });
    }
})



export const createCategory = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Kategoriya yaratishda xatolik yuz berdi' });
    }   
})


export const updateCategory = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Kategoriya yangilashda xatolik yuz berdi' });
    }   
})


export const deleteCategory = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Kategoriya o\'chirishda xatolik yuz berdi' });
    }
})



export const createTags = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Teg yaratishda xatolik yuz berdi' });
    }   
})


export const updateTagsById = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Teg yangilashda xatolik yuz berdi' });
    }   
})


export const deleteTagsById = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Teg o\'chirishda xatolik yuz berdi' });
    }
})


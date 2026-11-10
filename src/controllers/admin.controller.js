import slugify from 'slugify';
import Category from "../models/categories.model";
import News from "../models/news.model";
import User from "../models/User.model";
import ApiError from "../utils/ApiError.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import Tag from '../models/tags.model';


// DASHBOARD 

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


// NEWS - YANGILIKLAR
export const getAdminNews = asyncHandler(async (req, res) => {
    try {
        const {page = 1, limit = 10, status, category, q, sort = 'newest'} = req.query;

        const pageNum = Math.max(1, parseInt(page, 10 || 1));
        const limitNum = Math.max(50, Math.max(parseInt(limit, 10 || 10)));
        const skip = (pageNum - 1) * limitNum;
        
        const filter = {};
        if (status) {
            filter.status = status;
        }

        if (category) {
            const categoryData = await Category.findOne({ slug: category });
            if (categoryData) {
                filter.category = categoryData._id;
            }else {
                filter.category = category;
            }
        }

        if (q) {
            filter.$text = { $search: q };
        }

        const sortOptions = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        

        const [news, totalNews] = await Promise.all([
            News.find(filter)
                .populate('author', 'name')
                .populate('category', 'name slug')
                .populate('tags', 'name slug')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            News.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalNews / limitNum) || 1;

        res.status(200).json({
            success: true,
            message: 'User yaratgan yangiliklar ro\'yxati',
            data: news,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalNews,
                totalPages,
            },
        });


    } catch (error) {
        res.status(500).json({ message: 'Yangiliklarni olishda xatolik yuz berdi' });
    }
})

export const approveNews = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);

        if (!news) {
            throw new ApiError(404,'Yangilik topilmadi');
        }

        news.status = 'PUBLISHED';
        news.reviewedBy = req.user._id;
        news.reviewedAt = new Date();
        news.publishedAt = news.publishedAt || new Date();
        news.rejectReason = undefined;

        await news.save();

        res.status(200).json({
            success: true,
            message: 'Yangilik tasdiqlandi',
            data: news
        });
    } catch (error) {
        res.status(500).json({ message: 'Yangilikni tasdiqlashda xatolik yuz berdi' });
    }
})

export const rejectNews = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const news = await News.findById(id);

        if (!news) {
            throw new ApiError(404, 'Yangilik topilmadi');
        }

        news.status = 'REJECTED';
        news.rejectReason = reason || 'Sabab yozilmagan';
        news.reviewedBy = req.user._id;
        news.reviewedAt = new Date();

        await news.save()

        res.status(200).json({
            success: true,
            message: 'Yangilik rad qilindi',
            data: news
        })

    } catch (error) {
        res.status(500).json({ message: 'Yangilikni rad etishda xatolik yuz berdi' });
    }
})

//  USERLAR
export const getAdminUsers = asyncHandler(async (req, res) => {
    try {
        const {
            page = 1,
            limit =10,
            search,
            isBlocked
        } = req.query

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (pageNum - 1) * limitNum;

        const filter = {}

        if (isBlocked !== undefined) {
            filter.isBlocked = isBlocked === 'true';
        }

        if (search) {
            filter.$or = [
                {name: {$regex: search, $options: 'i'}},
                {email: {$regex: search, $options: 'i'}}
            ]
        }

        const [users, userTolal] = await Promise.all([
            User.find(filter).select('-password').sort({createdAt: -1}).skip(skip).limit(limitNum).lean(),
            User.countDocuments(filter)
        ])

        const totalPages = Math.ceil(userTolal / limitNum) || 1;

        res.status(200).json({
            success: true,
            data: users,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalUsers: userTolal,
                totalPages
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik yuz berdi' });
    }
})


export const getAdminUsersNews = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, status, sort = 'newest' } = req.query;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, 'Foydalanuvchi topilmadi');
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (pageNum - 1) * limitNum;

        const filter = { author: user._id };
        if (status) {
            filter.status = status;
        }

        const sortOptions = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

        const [news, totalNews] = await Promise.all([
            News.find(filter)
                .populate('author', 'name')
                .populate('tags', 'name slug')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
                lean(),
            News.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalNews / limitNum) || 1;

        res.status(200).json({
            success: true,
            data: news,
            meta: {
                page: pageNum,
                limit: limitNum,
                totalNews,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchining yangiliklarini olishda xatolik yuz berdi' });
    }   
})


// USERLARNI BLOKLASH VA BLOKDAN CHIQARISH
export const blockUser =asyncHandler (async (req, res) => {
    try {
        const { id } = req.params;
        const {reason} = req.body;

        if (req.user._id.toString() === id) {
            throw new ApiError(400, 'Admin o\'zini o\'zi bloklay olmaydi');
        }

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, 'Foydalanuvchi topilmadi');
        }

        if (user.role === 'ADMIN') {
            throw new ApiError(403, 'Admin akkountini bloklash mumkin emas');
        }

        if (user.isBlocked) {
            throw new ApiError(400, 'Foydalanuvchi allaqachon bloklangan');
        }


        user.isBlocked = true;
        user.blockReason = reason || 'Sabab yozilmagan';
        user.blockedAt = new Date();
        user.blockedBy = req.user._id;
        user.tokenVersion = (user.tokenVersion || 0) + 1;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Foydalanuvchi bloklandi',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
                blockReason: user.blockReason,
                blockedAt: user.blockedAt,
                blockedBy: user.blockedBy,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini bloklashda xatolik yuz berdi' });
    }   
})

export const unblockUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, 'Foydalanuvchi topilmadi');
        }

        if (!user.isBlocked) {
            throw new ApiError(400, 'Foydalanuvchi bloklanmagan');
        }

        user.isBlocked = false;
        user.blockReason = undefined;
        user.blockedAt = undefined;
        user.blockedBy = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Foydalanuvchi blokdan chiqarildi',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini blokdan chiqarishda xatolik yuz berdi' });
    }
})





import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import News from '../models/news.model.js';

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId);

    if (
      !user ||
      user.isBlocked ||
      user.tokenVersion !== decoded.tokenVersion
    ) {
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
});




export const getNewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;


        const news = await News.findOne({ slug })
            .populate('author', 'name')
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'Yangilik topilmadi'
            });
        }


        if (news.status !== 'PUBLISHED') {
            const isAdmin = req.user?.role === 'ADMIN';
            const isAuthor =
                req.user && news.author._id.toString() === req.user._id.toString();

            if (!isAdmin && !isAuthor) {
                return res.status(404).json({
                    success: false,
                    message: 'Yangilik topilmadi'
                });
            }
        }

        res.status(200).json({
            success: true,
            data: news
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Yangilikni olishda xatolik yuz berdi'
        });
    }
};
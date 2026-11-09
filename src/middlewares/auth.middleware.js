import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../models/User.model.js';

dotenv.config()

export const authenticate = async (req, res, next) => {
  try {
    // console.log(req.cookies.accessToken);
    
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // console.log(decoded);
    
    const user = await User.findById(decoded.userId); 
    
    // console.log(user);
    
    if (!user) {
      return res.status(401).json({ message: 'Foydalanuvchi tizimda yoq' });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token muddati tugagan yoki yaroqsiz",
      error: error.message,
    });
  }
};


export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(new ApiError(403, "Bu amalni bajarish uchun sizda ruxsat yo'q"));
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Kirish qismida xatolik yuz berdi yani siz avtorizatsiya o'tmagansiz",
        error: error.message,
      });
    }
  };
};


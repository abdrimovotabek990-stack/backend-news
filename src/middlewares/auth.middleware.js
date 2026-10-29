import jwt from 'jsonwebtoken';
import Users from '../models/user.model.js';
import dotenv from 'dotenv'

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
    
    const user = await Users.findById(decoded.userId); 
    
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

export const authRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Sizda bu amal uchun ruxsat yo'q" });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        message: "Kirish qismida xatolik yuz berdi yani siz avtorizatsiya o'tmagansiz",
        error: error.message,
      });
    }
  };
};
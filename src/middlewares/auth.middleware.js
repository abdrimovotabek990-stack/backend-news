import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.utils.js';


export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new ApiError(401, 'Token topilmadi, Qayta tizimga kiring'));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ApiError(401, 'Foydalanuvchi tizimda topilmadi'));
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      return next(new ApiError(401, 'Sessiya bekor qilingan, qayta tizimga kiring'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Token muddati tugagan yoki yaroqsiz'));
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId);

    if (user && decoded.tokenVersion === user.tokenVersion && !user.isBlocked) {
      req.user = user;
    }

    return next();
  } catch {
    return next();
  }
};

export const checkBlocked = (req, res, next) => {
  if (req.user?.isBlocked) {
    const reason = req.user.blockReason ? ` Sabab: ${req.user.blockReason}` : '';
    return next(new ApiError(403, `Sizning akkauntingiz bloklangan.${reason}`));
  }
  return next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Bu amalni bajarish uchun sizda ruxsat yo'q"));
    }
    return next();
  };
};